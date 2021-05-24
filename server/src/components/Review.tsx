import { Avatar, Grid, Paper, Typography } from "@material-ui/core";
import React, { Component } from "react";
import styles from "../styles/Review.module.scss";

export interface IReview {
    id: number;
    stars: number;
    review: string;
    author: number;
    created: Date;
    product: number;
    last_updated: Date;
    username: string;
}

export default class Review extends Component<IReview> {
    render() {
        return (
            <Paper key={this.props.id}>
                <Grid container wrap="nowrap" spacing={2} className={styles.paper}>
                    <Grid item>
                        <Avatar src={"/api/profile.jpg?id=" + this.props.id}/>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h6">{this.props.username}</Typography>
                        <Typography>{this.props.review}</Typography>
                        <Typography>Rating: {this.props.stars}</Typography>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}