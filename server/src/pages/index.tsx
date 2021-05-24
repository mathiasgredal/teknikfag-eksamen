import { GetServerSideProps } from "next";
import React, { Component } from "react";
import styles from "../styles/Main.module.scss";

class Index extends Component {
	render() {
		return (
			<>
				<main>
					<h1 className={styles.title}>Webshop teknikfag</h1>
					<p>Hej! Dette er hjemmesiden til teknikfagseksamen.</p>
					<p>For at se produkterne, så skal man klikke på "Products" i navigationsbaren.</p>
					<p>Hvis man vil søge, så kan man benytte søgebaren ovenover.</p>
					<p>For at skrive produktanmeldelser kræver det at man har oprettet en bruger og er logget ind.</p>
				</main>
			</>
		);
	}
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	return { props: {} };
};

export default Index;
