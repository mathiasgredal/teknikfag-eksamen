import React, { Component } from "react";

import { GetServerSideProps } from "next";
import DefaultErrorPage from "next/error";

import {
	Avatar,
	Button,
	Grid,
	Typography,
	Paper,
	Fab,
} from "@material-ui/core";
import { ArrowBack, Add } from "@material-ui/icons";
import Rating from "@material-ui/lab/Rating";
import ModalImage from "react-modal-image";

import styles from "../styles/Product.module.scss";
import { ICellProps } from "../components/Cell";
import Draggable from "react-draggable";
import Review, { IReview } from "../components/Review";
import { IProfileStatus } from "../lib/auth_helper";

interface ProductPageProps {
	id: number;
	product?: ICellProps;
	reviews: IReview[];
	profile?: IProfileStatus;
}

export default class ProductPage extends Component<ProductPageProps> {
	makeReview = async () => {
		if (!this.props.profile.isLoggedIn) {
			alert("You are not logged in");
		}
		if (this.props.profile.isLoggedIn) {
			var review_prompt = prompt("Please enter your review:");
			while (review_prompt == "") {
				var review_prompt = prompt("Please enter your review:");
			}

			var stars_prompt = prompt("Please enter your rating:");
			var starsParsed = parseInt(stars_prompt);

			while (
				(stars_prompt != null && Number(starsParsed) > 5) ||
				Number(starsParsed) <= 0
			) {
				alert("Please type a valid number");
				var stars_prompt = prompt("Please enter your rating:");
				var starsParsed = parseInt(stars_prompt);
				while (isNaN(starsParsed)) {
					alert("You typed a string");
					stars_prompt = prompt("Please enter your rating:");
					starsParsed = parseInt(stars_prompt);
				}
			}

			if (review_prompt != null && !isNaN(starsParsed)) {
				const reviewApi = await fetch(`/api/reviewInsert`, {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						review: review_prompt,
						stars: stars_prompt,
						product: this.props.id,
					}),
				});

				// Reload page after we get a response from the api request
				setTimeout(()=> location.reload(), 100)
			}
		}
	};

	render() {
		if (this.props.id == NaN || this.props.id == undefined)
			return <DefaultErrorPage statusCode={404} />;

		return (
			<main className={styles.content}>
					<div className={styles.left}>
						<Button
							onClick={() => window.history.back()}
							className={styles.back}
						>
							<ArrowBack /> Go back!
						</Button>

						<div className={styles.order}>
							<div className={styles.header}>
								<Typography variant="h5">Order now:</Typography>
							</div>
							<div className={styles.divider} />
							<div className={styles.form}>
								<form
									method="POST"
									action={
										"/api/buyproduct?id=" + this.props.id
									}
								>
									<label
										className={styles.label}
										htmlFor="quantity"
									>
										Quantity:
									</label>
									<input
										className={styles.input}
										type="number"
										id="quantity"
										name="quantity"
										min="1"
										max={this.props.product.stock}
									></input>
									<div>
										<Button
											variant="contained"
											color="primary"
											type="submit"
										>
											BUY NOW!
										</Button>
									</div>
								</form>
							</div>
						</div>
					</div>

					<div className={styles.productContainer}>
						<div className={styles.productInfo}>
							<Typography variant="h5">
								{this.props.product.name}
							</Typography>
							<hr />
							<b>Rating:</b>
							<br />
							<Rating
								name="size-large"
								defaultValue={2.4}
								size="large"
								style={{ color: "red" }}
							/>
							<br />
							<b>Info:</b>
							<Typography variant="body1">
								<blockquote>
									{this.props.product.description}
								</blockquote>
							</Typography>
							<Typography variant="body1">
								<b>Price:</b> {this.props.product.price} dkk
							</Typography>
							<Typography variant="body1">
								<b>Stock:</b> {this.props.product.stock}
							</Typography>
						</div>
						<div className={styles.verticaldivider} />
						<div className={styles.productRight}>
							<div className={styles.productImage}>
                                <div className={styles.childImage}>
                                <ModalImage
									small={
										"/api/product.jpg?id=" + this.props.id
									}
									large={
										"/api/product.jpg?id=" + this.props.id
									}
									alt={
										"Billede af " + this.props.product.name
									}
									showRotate
									hideZoom
								/>
                                </div>
								
							</div>
							<div className={styles.divider} />
							<div className={styles.productReview}>
									{this.props.reviews.map((review) => (
										<Review {...review} />
									))}
							</div>
							<Draggable defaultClassName={styles.actionBtn}>
								<Fab
									color="primary"
									aria-label="add"
									onClick={this.makeReview}
									className={styles.actionBtn}
								>
									<Add />
								</Fab>
							</Draggable>
						</div>
					</div>
				</main>
		);
	}
}

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
	let { db_req } = await import("../lib/db_helper");

	let productId = Number(context.query["id"]);
	if (Number.isSafeInteger(productId)) {
		let pageProps: ProductPageProps = {
			id: productId,
			product: JSON.parse(
				JSON.stringify(
					await (
						await db_req("SELECT * FROM products WHERE id = $1", [
							productId,
						])
					).rows[0]
				)
			),
			reviews: JSON.parse(
				JSON.stringify(
					(
						await db_req(
							"SELECT * FROM reviews INNER JOIN users ON reviews.author=users.id WHERE product = $1",
							[productId]
						)
					).rows
				)
			),
		};

		return { props: pageProps };
	}

	return { props: { id: null } };
};
