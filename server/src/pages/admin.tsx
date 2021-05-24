import { GetServerSideProps } from "next";
import React, { Component } from "react";
import { IProfileStatus, IUser } from "../lib/auth_helper";
import Error from "next/error";
import styles from "../styles/Admin.module.scss";
import { ReactTabulator } from "react-tabulator";
import { ICellProps } from "../components/Cell";
import { Button, TextField } from "@material-ui/core";
import moment from "moment";

interface AdminPageProps {
	profile: IProfileStatus;
	users: IUser[];
	products: ICellProps[];
	categories: { id: number; name: string }[];
	error?: string;
}

interface AdminPageState {
	userRow: any;
	name: string;
	description: string;
	price: number;
	stock: number;
	category: number;
	image: string;
}

class AdminPage extends Component<AdminPageProps, AdminPageState> {
	constructor(props: AdminPageProps) {
		super(props);
		this.state = {
			userRow: undefined,
			name: "",
			description: "",
			price: 0,
			stock: 0,
			category: 0,
			image: "",
		};
	}

	componentDidMount() {
		// @ts-expect-error: This is used for date formatting in tables
		window.moment = moment;

		// We make an alert, if any errors are present in query params
		if (this.props.error) setTimeout(() => alert(this.props.error), 1);
	}

	resetProduct = () => {
		this.setState({
			name: "",
			description: "",
			price: 0,
			stock: 0,
			category: 0,
		});
	};

	onProductSelect = (row: number) => {
		if (this.state.userRow == undefined)
			this.setState({
				userRow: row,
			});
		else if (this.state.userRow != row) {
			this.state.userRow.deselect();
			this.setState({
				userRow: row,
			});
		}

		this.setState({
			name: this.state.userRow._row.data["name"],
			description: this.state.userRow._row.data["description"],
			price: this.state.userRow._row.data["price"],
			stock: this.state.userRow._row.data["stock"],
			category: this.state.userRow._row.data["category"],
		});
	};

	onProductDeselect = (row: number) => {
		this.setState({
			userRow: undefined,
		});

		this.resetProduct();
	};

	onSubmit = () => {
    if(!this.state.userRow)
      return;

    let form = document.getElementById('productform') as HTMLFormElement;

    let input = document.createElement('input');
    input.setAttribute('name', 'UpdateID');
    input.setAttribute('value', this.state.userRow._row.data["id"]);
    input.setAttribute('type', 'hidden')
    form.appendChild(input);

    form.submit();
  };

	render() {
		if (!this.props.profile.isAdmin || !this.props.profile.isLoggedIn)
			return (
				<Error
					statusCode={403}
					title="FORBIDDEN: This user doesn't have admin rights"
				/>
			);
		else
			return (
				<div className={styles.container}>
					<div className={`${styles.edit} ${styles.tile}`}>
						<div className={styles.header}>
							{this.state.userRow ? "Edit" : "Create"} product
						</div>
						<form
              id="productform"
							className={styles.form}
							method="POST"
							action="/api/createproduct"
							encType="multipart/form-data"
							onSubmit={this.onSubmit}
						>
							<TextField
								label="Name"
								type="text"
								name="name"
								value={this.state.name}
								onChange={(e) =>
									this.setState({ name: e.target.value })
								}
								InputLabelProps={{
									shrink: true,
								}}
							/>
							<TextField
								label="Beskrivelse"
								type="text"
								name="description"
								multiline
								rows={4}
								variant="filled"
								value={this.state.description}
								onChange={(e) =>
									this.setState({
										description: e.target.value,
									})
								}
								InputLabelProps={{ shrink: true }}
							/>
							<TextField
								label="Pris"
								type="number"
								name="price"
								value={this.state.price}
								onChange={(e) =>
									this.setState({
										price: Number(e.target.value),
									})
								}
								InputLabelProps={{ shrink: true }}
							/>
							<TextField
								label="Lager"
								type="number"
								name="stock"
								value={this.state.stock}
								onChange={(e) =>
									this.setState({
										stock: Number(e.target.value),
									})
								}
								InputLabelProps={{ shrink: true }}
							/>
							<TextField
								label="Kategori"
								select
								name="category"
								value={this.state.category}
								onChange={(e) =>
									this.setState({
										category: Number(e.target.value),
									})
								}
								SelectProps={{ native: true }}
								InputLabelProps={{ shrink: true }}
							>
								{this.props.categories.map((category) => (
									<option
										key={category.id}
										value={category.id}
									>
										{category.name}
									</option>
								))}
							</TextField>
							<TextField
								name="image"
								label="Billede"
								type="file"
								InputLabelProps={{
									shrink: true,
								}}
							/>
							<div style={{ flex: 1 }} />
							<div className={styles.formButtonGroup}>
								<div style={{ display: "flex" }}>
									<Button
										variant="contained"
										className={styles.resetButton}
									>
										Reset
									</Button>
									<Button
										variant="contained"
										className={styles.submitButton}
										type="submit"
									>
										{this.state.userRow ? "Update" : "Create" }
									</Button>
								</div>
								{this.state.userRow ? (
                <form method="POST"
                action={"/api/deleteproduct?id="+this.state.userRow._row.data["id"]}>
<Button variant="contained" color="secondary" type="submit">Delete</Button>
                </form>
                ) : (<></>)}
							</div>
						</form>
					</div>

					<div className={`${styles.product} ${styles.tile}`}>
						<div className={styles.header}>Products</div>
						<ReactTabulator
							columns={[
								{ title: "Id", field: "id" },
								{ title: "Name", field: "name" },
								{ title: "Description", field: "description" },
								{
									title: "Price",
									field: "price",
									formatter: "money",
									formatterParams: {
										symbol: " kr.",
										symbolAfter: true,
									},
								},
								{ title: "Stock", field: "stock" },
								{ title: "Category", field: "category_name" },
							]}
							options={{
								selectable: true,
								rowSelected: this.onProductSelect,
								rowDeselected: this.onProductDeselect,
							}}
							data={
								this.props.products ? this.props.products : []
							}
							className={styles.table}
						/>
					</div>

					<div className={`${styles.user} ${styles.tile}`}>
						<div className={styles.header}>Users</div>
						<ReactTabulator
							columns={[
								{ title: "Id", field: "id" },
								{ title: "Name", field: "username" },
								{
									title: "Birthday",
									field: "birthday",
									formatter: "datetime",
									formatterParams: {
										outputFormat: "YYYY-MM-DD",
									},
								},
								{ title: "Country", field: "country_name" },
								{
									title: "Admin",
									field: "isadmin",
									formatter: "tickCross",
								},
							]}
							data={this.props.users ? this.props.users : []}
							className={styles.table}
						/>
					</div>
				</div>
			);
	}
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	let { getCookie, GetProfileStatus } = await import("../lib/auth_helper");
	let { db_req } = await import("../lib/db_helper");

	let token = getCookie("token", context.req.headers.cookie);
	let myprofile = GetProfileStatus(token);
	if (myprofile.isAdmin)
		return {
			props: {
				users: JSON.parse(
					JSON.stringify(
						(
							await db_req(
								"SELECT users.id, username, birthday, country_name, isadmin FROM users INNER JOIN countries ON users.country=countries.id;"
							)
						).rows
					)
				),
				products: JSON.parse(
					JSON.stringify(
						(
							await db_req(
								"SELECT products.id, products.name, category, categories.name as category_name, price, stock, description FROM products INNER JOIN categories ON products.category=categories.id;"
							)
						).rows
					)
				),
				categories: (await db_req("SELECT * FROM categories;")).rows,
				error: context.query["error"] ? context.query["error"] : null,
			},
		};
	else return { props: {} };
};

export default AdminPage;
