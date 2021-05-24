import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { IUser, JWT_SECRET } from '../../lib/auth_helper'
import { db_req } from '../../lib/db_helper'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST')
        return res.status(405).json({ status: 'error', error: 'Method not allowed' });

    const { username, password } = req.body;
    if (!username && !password)
        return res.status(400).json({ status: 'error', error: 'Request missing username and password' });
    else if (!username || !password)
        return res.status(400).json({ status: 'error', error: 'Request missing username or password' });

    const user_req = (await db_req("SELECT id, username, birthday, country, registered, isadmin, password FROM users WHERE username = $1", [username]));

    if (user_req.rowCount == 0)
        return res.status(400).json({ status: 'error', error: 'User Not Found' });

    const user: IUser = user_req.rows[0];

    console.log(user.password);
   
    if (!await bcrypt.compare(password, user.password))
        return res.status(400).json({ status: 'error', error: 'Password incorrect' });

    jwt.sign(user, JWT_SECRET, { expiresIn: 365 * 24 * 60 * 60 }, (err, token) => {
        if (err)
            res.status(500).json({ status: 'error', error: 'Could not sign JWT' });
        else
            res.status(200).json({ success: true, token: 'Bearer ' + token });
    });
};