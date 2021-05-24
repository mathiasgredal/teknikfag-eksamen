import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import formidable from 'formidable';

import { getCookie, GetProfileStatus, IUser } from '../../lib/auth_helper'
import { db_req } from '../../lib/db_helper'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET')
        return res.status(405).json({ status: 'error', error: 'Method not allowed' });

    let token = getCookie("token", req.headers.cookie);
    res.status(200).json(GetProfileStatus(token))
};