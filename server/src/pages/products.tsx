import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { GetServerSideProps } from "next";
import { Typography } from "@material-ui/core";

import styles from "../styles/Products.module.scss";
import Cell, { ICellProps } from "../components/Cell";
import Slider from "../components/Slider";

interface ICategory {
	id: number;
	name: string;
}

interface FilterOptions {
	search: string;
	catId: number;
	minPrice: number;
	maxPrice: number;
	minStock: number;
}

interface ProductsPageProps {
	categories: ICategory[];
	products: ICellProps[];
	filter: FilterOptions;
	maxPrice: number;
	maxStock: number;
}

export default class ProductsPage extends Component<ProductsPageProps> {
	onChangePriceRange = (priceRange: number[]) => {
		if ("URLSearchParams" in window) {
			var searchParams = new URLSearchParams(window.location.search);
			searchParams.set("minprice", String(priceRange[0]));
			searchParams.set("maxprice", String(priceRange[1]));
			var newRelativePathQuery = window.location.pathname + "?" + searchParams.toString();
            history.replaceState(null, "", newRelativePathQuery);
		}
		this.props.filter.minPrice = priceRange[0];
		this.props.filter.maxPrice = priceRange[1];
		this.setState({});
	};

	onChangeStock = (minStock: number) => {
		if ("URLSearchParams" in window) {
			var searchParams = new URLSearchParams(window.location.search);
			searchParams.set("minstock", String(minStock));
			var newRelativePathQuery =
				window.location.pathname + "?" + searchParams.toString();
			history.replaceState(null, "", newRelativePathQuery);
		}
		this.props.filter.minStock = minStock;
		this.setState({});
	};

	onChangeCategory = (catId: number) => {
		if ("URLSearchParams" in window) {
			var searchParams = new URLSearchParams(window.location.search);
			if (Number.isNaN(catId) || catId == undefined || catId == 0)
				searchParams.delete("catid");
			else searchParams.set("catid", String(catId));
			var newRelativePathQuery =
				window.location.pathname + "?" + searchParams.toString();
			history.replaceState(null, "", newRelativePathQuery);
		}
		this.props.filter.catId = catId;
		this.setState({});
	};

	getFilteredProducts(): ICellProps[] {
		let products = this.props.products;

		if (
			!Number.isNaN(this.props.filter.catId) &&
			this.props.filter.catId != undefined
		)
			products = products.filter(
				(val) => val.category == this.props.filter.catId
			);

		if (
			!Number.isNaN(this.props.filter.minPrice) &&
			this.props.filter.minPrice != undefined
		)
			products = products.filter(
				(val) => val.price >= this.props.filter.minPrice
			);

		if (
			!Number.isNaN(this.props.filter.maxPrice) &&
			this.props.filter.maxPrice != undefined
		)
			products = products.filter(
				(val) => val.price <= this.props.filter.maxPrice
			);

		if (
			!Number.isNaN(this.props.filter.minStock) &&
			this.props.filter.minStock != undefined
		)
			products = products.filter(
				(val) => val.stock >= this.props.filter.minStock
			);

		return products;
	}

	render() {
		return (
			<>
				{this.props.filter.search !== "" ? (
					<div className={styles.searchText}>
						<span>Search results for </span>
						<i>"{this.props.filter.search}"</i>
					</div>
				) : (
					<br/>
				)}
				<main className={styles.content}>
					<div className={styles.filter}>
						<div className={styles.header}>
							<Typography variant="h5">Filtering:</Typography>
						</div>
						<div className={styles.divider} />
						<div className={styles.form}>
							<Form>
								<Form.Group>
									<Form.Label
										className={styles.label}
										htmlFor="Category ID"
									>
										Kategori:{" "}
									</Form.Label>
									<Form.Control
										id="catid"
										name="catid"
										as="select"
										size="sm"
										value={this.props.filter.catId}
										onChange={(event) =>
											this.onChangeCategory(
												Number(event.target.value)
											)
										}
									>
										<option key={0} value={Number.NaN}>
											All
										</option>
										{this.props.categories.map(
											(option: ICategory) => (
												<option
													key={option.id}
													value={option.id}
												>
													{option.name}
												</option>
											)
										)}
									</Form.Control>
								</Form.Group>
								<hr />
								<Form.Group controlId="priceRange">
									<Form.Label className={styles.label}>
										Pris:
									</Form.Label>
									<Slider
										begin={[
											this.props.filter.minPrice,
											this.props.filter.maxPrice,
										]}
										min={0}
										max={this.props.maxPrice}
										suffix="kr."
										double
										onUpdateSlider={this.onChangePriceRange}
									/>
								</Form.Group>
								<hr />
								<Form.Group controlId="stock">
									<Form.Label className={styles.label}>
										Lager:
									</Form.Label>
									<Slider
										begin={this.props.filter.minStock}
										min={0}
										max={this.props.maxStock}
										suffix="stk."
										onUpdateSlider={this.onChangeStock}
									/>
								</Form.Group>
								<hr />
								<Button
									variant="primary"
									onClick={() => {
										location.reload();
									}}
								>
									OK
								</Button>
							</Form>
						</div>
					</div>

					<div className={styles.productContainer}>
						<div className={styles.productGrid}>
							{this.getFilteredProducts().map((product) => (
								<Cell {...product}></Cell>
							))}
						</div>
					</div>
				</main>
			</>
		);
	}
}

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
	let { getCookie, GetProfileStatus } = await import("../lib/auth_helper");
	let { db_req } = await import("../lib/db_helper");

	let searchTerm = context.query["search"] ? String(context.query["search"]) : "";

	let pageProps: ProductsPageProps = {
		filter: {
			search: searchTerm,
			catId: Number(context.query["catid"]),
			minPrice: Number(context.query["minprice"]),
			maxPrice: Number(context.query["maxprice"]),
			minStock: Number(context.query["minstock"]),
		},
		categories: (await db_req("SELECT * FROM categories;")).rows,
		products: JSON.parse(
			JSON.stringify(
				(
					await db_req(
						"SELECT * FROM products WHERE name ILIKE $1;",
						["%" + searchTerm + "%"]
					)
				).rows
			)
		),
		maxPrice: await (
			await db_req(
				"SELECT price FROM products WHERE price >= ALL(SELECT price FROM products);"
			)
		).rows[0].price,
		maxStock: await (
			await db_req(
				"SELECT stock FROM products WHERE stock >= ALL(SELECT stock FROM products);"
			)
		).rows[0].stock,
	};

	if (!Number.isSafeInteger(pageProps.filter.maxPrice))
		pageProps.filter.maxPrice = pageProps.maxPrice;
	if (!Number.isSafeInteger(pageProps.filter.minPrice))
		pageProps.filter.minPrice = 0;
	if (!Number.isSafeInteger(pageProps.filter.minStock))
		pageProps.filter.minStock = 0;

	return { props: pageProps };
};
