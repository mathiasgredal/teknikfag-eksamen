import Router from 'next/router';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = "8311f12749bb5e66d0fbbca97bdfac63c7f074b26e";

export interface IProfileStatus {
  id: number;
  username?: string;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  error?: string;
}

export interface IUser {
  id: number;
  username: string;
  birthday?: Date;
  country?: number;
  registered: Date;
  password: string;
  profile_picture?: string;
  isadmin: boolean;
}

export function GetProfileStatus(token: string): IProfileStatus {
  if (!token)
    return {
      id: 0,
      username: "",
      isAdmin: false,
      isLoggedIn: false,
      error: "ERROR: No JWT found in cookies"
    }

  try {
    let verification: any = jwt.verify(token.split(' ')[1], JWT_SECRET);
    if (typeof verification == 'string')
      throw "ERROR: Incorrect JWT"
    return {id: verification.id, username: verification.username ,isLoggedIn: true, isAdmin: verification.isadmin, error: ""};
  } catch (error) {
    return {
      id: 0,
      username: "",
      isAdmin: false,
      isLoggedIn: false,
      error: "ERROR: Could not verify JWT"
    }
  }
}

export function getCookie(cookiename, cookies) {
  var cookiestring = RegExp(cookiename + "=[^;]+").exec(cookies);
  return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}

export function setLogout(e) {
  e.preventDefault();
  Cookies.remove('token');
  Router.push('/');
}