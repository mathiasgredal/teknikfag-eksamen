import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie, GetProfileStatus, IUser, JWT_SECRET } from '../../lib/auth_helper'
import { db_req } from '../../lib/db_helper'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST')
        return res.status(405).json({ status: 'error', error: 'Method not allowed' });

    let token = getCookie("token", req.headers.cookie);

    if (token) {
        let profile = GetProfileStatus(token);
        console.log(profile);
        db_req("INSERT INTO reviews (stars, review, author, created, product, last_updated) VALUES ($1, $2, $3, $4, $5, $6)",
        [req.body["stars"], req.body["review"], profile.id, "2020-04-06", req.body["product"], "2020-04-06"]);
    }

};