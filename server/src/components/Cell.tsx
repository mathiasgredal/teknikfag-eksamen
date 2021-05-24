import React, { Component } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button, Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Typography } from '@material-ui/core';
import { Favorite, Share, MoreVert } from '@material-ui/icons';
import { format } from 'date-fns'
import Link from 'next/link';

export interface ICellProps {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: number;
    image: string;
    created: string;
    last_updated: string;
}

export default class Cell extends Component<ICellProps> {
    render() {
        return (
            <Card>
                <CardHeader
                    avatar={
                        <div></div>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVert />
                        </IconButton>
                    }
                    title={this.props.name}
                    titleTypographyProps={{ variant: 'h6', component: "b" }}
                    subheader={format(new Date(this.props.created), "MMMM d, yyyy")}
                />
                <CardMedia
                    style={{ height: 150 }}
                    image={"/api/product.jpg?id=" + this.props.id}
                    title={this.props.name}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p" style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}> {this.props.description}</Typography>
                    <Typography variant="body2" color="textPrimary" component="p"><b>Price: </b>{this.props.price}kr.</Typography>
                    <Typography variant="body2" color="textPrimary" component="p"><b>Stock: </b> {this.props.stock} {this.props.stock === 1 ? "item" : "items"}</Typography>
                </CardContent>
                <CardActions style={{ justifyContent: "space-between", marginTop: "-20px" }}>
                    <div>
                        <Button href={"/product?id=" + this.props.id} style={{ marginLeft: "8px" }} variant="contained" color="primary">View</Button>
                    </div>

                    <div>
                        <IconButton aria-label="add to favorites">
                            <Favorite />
                        </IconButton>
                        <IconButton aria-label="share">
                            <Share />
                        </IconButton>
                    </div>
                </CardActions>
            </Card>
        );
    }
}