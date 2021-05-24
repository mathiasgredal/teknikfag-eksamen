import styles from "../styles/Login.module.scss";
import React, { Component } from "react";
import Cookies from "js-cookie";

import { GetServerSideProps } from "next";
import Router from "next/router";
import Link from "next/link";

import {
	FormControl,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	TextField,
	Typography,
	Button,
} from "@material-ui/core";
import {
	AccountCircle,
	Visibility,
	VisibilityOff,
	Lock,
} from "@material-ui/icons";

import { IProfileStatus } from "../lib/auth_helper";

export interface LoginPageProps {
	profile: IProfileStatus;
}

export interface LoginPageState {
	brugernavn: string;
	password: string;
	showpassword: boolean;
}

class LoginPage extends Component<LoginPageProps, LoginPageState> {
	constructor(props: LoginPageProps) {
		super(props);
		this.state = {
			brugernavn: "",
			password: "",
			showpassword: false,
		};
	}

	onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ brugernavn: event.target.value });
	};

	onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ password: event.target.value });
	};

	onClickShowPassword = () => {
		this.setState({ showpassword: !this.state.showpassword });
	};

	onLogin = async () => {
		try {
			const loginApi = await fetch(`/api/login`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: this.state.brugernavn,
					password: this.state.password,
				}),
			});

			let result = await loginApi.json();

			if (result.success && result.token) {
				Cookies.set("token", result.token);
				Router.push("/");
			} else {
				alert("Error: " + result.error);
			}
		} catch (error) {
			alert("Error: " + error);
		}
	};

	componentDidMount() {
		if (this.props.profile.isLoggedIn) {
			setTimeout(() => {
				Router.push("/");
			}, 1500);
		}
	}

	onKeyDownHandler = (e) => {
		if (e.keyCode === 13) this.onLogin();
	};

	render() {
		if (this.props.profile.isLoggedIn)
			return <div>You are already logged in. Redirecting...</div>;

		return (
			<div className={styles.container}>
				<div className={styles.panel} />
				<Typography variant="h4" className={styles.title}>
					Webshop login
				</Typography>

				<div className={styles.loginContainer}>
					<div className={styles.usernameField}>
						<AccountCircle />
						<TextField
							id="username"
							label="Username"
							variant="standard"
							style={{ width: "35ch" }}
							value={this.state.brugernavn}
							onChange={this.onChangeUsername}
							onKeyDown={this.onKeyDownHandler}
						/>
					</div>

					<div className={styles.usernameField}>
						<Lock />
						<FormControl
							style={{ marginTop: "16px", width: "35ch" }}
						>
							<InputLabel htmlFor="standard-adornment-password">
								Password
							</InputLabel>
							<Input
								id="password"
								type={
									this.state.showpassword
										? "text"
										: "password"
								}
								value={this.state.password}
								onChange={this.onChangePassword}
								onKeyDown={this.onKeyDownHandler}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={this.onClickShowPassword}
											onMouseDown={(event) =>
												event.preventDefault()
											}
										>
											{this.state.showpassword ? (
												<Visibility />
											) : (
												<VisibilityOff />
											)}
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
					</div>
				</div>
				<div className={styles.signup}>
					Har du ikke en konto?{" "}
					<a href="/signup"> Tilmeld dig her.</a>
				</div>
				<div className={styles.loginButton}>
					<Button
						variant="contained"
						color="primary"
						onClick={this.onLogin}
					>
						Login
					</Button>
				</div>
			</div>
		);
	}
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	return { props: {} };
};

export default LoginPage;
