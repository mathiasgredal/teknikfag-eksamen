import React, { Component } from 'react';
import { FormControl, IconButton, Input, InputAdornment, InputLabel, TextField, Typography, Button } from '@material-ui/core';
import { GetServerSideProps } from "next";

import Router from 'next/router';
import { IProfileStatus, IUser } from '../lib/auth_helper';

export interface AccountPageProps {
    profile: IProfileStatus;
    country: string;
    user: IUser;
}

export interface AccountPageState {
    userPicture: string;
}

class AccountPage extends Component<AccountPageProps, AccountPageState> {
    constructor(props: AccountPageProps) {
        super(props);
        this.state = {
            userPicture: ""
        }
    }

    componentDidMount() {
        if(!this.props.profile.isLoggedIn) {
            setTimeout(()=> {
                Router.push('/login');
            }, 1500)
        }
    }

    setHarambe = async () => {
        this.setState({
            userPicture: "https://www.telegraph.co.uk/content/dam/news/2016/11/09/99356270-Harambe-gorilla-us-election-votes_jpg_trans_NvBQzQNjv4BqqVzuuqpFlyLIwiB6NTmJwfSVWeZ_vEN7c6bHu2jJnT8.jpg"
        })
    }

    render() {
        if(!this.props.profile.isLoggedIn)
            return <div>You are not logged in. Redirecting to login page...</div>
        return (
            <div>
                <div>
                    <h1>Account Page</h1>
                    <img style={{borderRadius: 125}} height="250px" width="250px" src="/api/profile.jpg"></img>
                    <div>
                    <br></br>
                    <Typography variant="body1"><b>Username: </b> {this.props.user.username}</Typography>
                    <Typography variant="body1"><b>Country: </b> {(this.props.user as any).country_name}</Typography>
                    <Typography variant="body1"><b>Birthday: </b> {(String(this.props.user.birthday)).split('T')[0]}</Typography>
                    <Typography variant="body1"><b>Registered: </b> {(String(this.props.user.registered)).split('T')[0]}</Typography>
                    <Typography variant="body1"><b>Is this user an admin?: </b> {String(this.props.user.isadmin)}</Typography>
                    </div>
                    <img src={this.state.userPicture} />
                </div>

                <div>
                    <Button variant="contained" color="primary" onClick={this.setHarambe}>Set Harambe</Button>
                </div>
            </div>
        );
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    console.log("HELLO - Gredal 2k21")
    let {getCookie, GetProfileStatus} = await import('../lib/auth_helper');
    let {db_req} = await import('../lib/db_helper');

  let token = getCookie("token", context.req.headers.cookie);
  let myprofile = GetProfileStatus(token);
    return { props: {
        user: JSON.parse(JSON.stringify(await (await db_req("SELECT * FROM users INNER JOIN countries ON users.country=countries.id WHERE username=$1;", [myprofile.username])).rows[0])),
    } };
}

export default AccountPage;
