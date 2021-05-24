import { GetServerSideProps } from "next";
import Router from "next/router";
import React, { Component } from "react";
import { IProfileStatus, IUser } from "../lib/auth_helper";

import styles from "../styles/Signup.module.scss";
import {
	Button,
	Checkbox,
	FormControlLabel,
	TextField,
	Typography,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";

interface SignupPageProps {
	profile: IProfileStatus;
	countries: { id: number; country_code: string; country_name: string }[];
	message?: string;
	isMac?: boolean;
}

interface SignupPageState {
	username: string;
	password: string;
	birthday: Date;
	country: number;
	profile_picture?: Buffer;
	isAdmin: boolean;
	termsAndConditions: boolean;
}

class SignupPage extends Component<SignupPageProps, SignupPageState> {
	constructor(props: SignupPageProps) {
		super(props);
		this.state = {
			username: "",
			password: "",
			birthday: new Date(0),
			country: 1,
			isAdmin: false,
			termsAndConditions: false,
		};
	}

	onSubmit = (event) => {
		// We do some simple form validation, and prevent submission if errors are found
		if (!this.state.username) {
			alert("Your username cannot be empty!");
			event.preventDefault();
		}

		if (!this.state.password) {
			alert("Your password cannot be empty!");
			event.preventDefault();
		}

		if (this.state.birthday > new Date()) {
			alert("Your birthday cannot be in the future");
			event.preventDefault();
		}

		if (!this.state.termsAndConditions) {
			alert("You must agree to the terms and conditions");
			event.preventDefault();
		}
	};

	render() {
		return (
			<div className={styles.container}>
				<form
					className={styles.form}
					method="POST"
					action="/api/signup"
					encType="multipart/form-data"
					onSubmit={this.onSubmit}
				>
					<Typography variant="h5">Sign Up</Typography>
					<TextField
						label="Brugernavn"
						type="text"
						name="username"
						value={this.state.username}
						onChange={(e) =>
							this.setState({ username: e.target.value })
						}
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						label="Kodeord"
						type="password"
						name="password"
						value={this.state.password}
						onChange={(e) =>
							this.setState({ password: e.target.value })
						}
						InputLabelProps={{
							shrink: true,
						}}
					/>
					{this.props.isMac ? (
						<KeyboardDatePicker
							margin="normal"
							id="date-picker-dialog"
							label="Date picker dialog"
							format="yyyy-MM-dd"
							value={this.state.birthday}
							onChange={(value) =>
								this.setState({ birthday: value })
							}
							KeyboardButtonProps={{
								"aria-label": "change date",
							}}
						/>
					) : (
						<TextField
							name="birthday"
							label="Fødselsdag"
							type="date"
							value={this.state.birthday
								.toISOString()
								.substr(0, 10)}
							onChange={(e) =>
								this.setState({
									birthday: new Date(e.target.value),
								})
							}
							InputLabelProps={{
								shrink: true,
							}}
						/>
					)}
					<TextField
						name="country"
						select
						label="Land"
						SelectProps={{
							native: true,
						}}
					>
						{this.props.countries.map((country) => (
							<option key={country.id} value={country.id}>
								{country.country_name}
							</option>
						))}
					</TextField>
					<TextField
						name="profile_picture"
						label="Profil billede"
						type="file"
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<div
						style={{
							gap: 10,
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<FormControlLabel
							control={
								<Checkbox
									name="isadmin"
									value={this.state.isAdmin}
									onChange={(e) =>
										this.setState({
											isAdmin: e.target.checked,
										})
									}
								/>
							}
							label="Is admin"
						/>
						<FormControlLabel
							control={
								<Checkbox
									name="termsandconditions"
									value={this.state.termsAndConditions}
									onChange={(e) =>
										this.setState({
											termsAndConditions:
												e.target.checked,
										})
									}
								/>
							}
							label="Agree to Terms and Conditions"
						/>
					</div>
					<Button type="submit">Submit</Button>
				</form>
			</div>
		);
	}
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	let { db_req } = await import("../lib/db_helper");

	console.log(context.req.headers["user-agent"]);
	return {
		props: {
			countries: (await db_req("SELECT * FROM countries;")).rows,
			isMac: context.req.headers["user-agent"].match(
				/^((?!chrome|android|crios|fxios|iPhone).)*safari/i
			),
		},
	};
};

export default SignupPage;
