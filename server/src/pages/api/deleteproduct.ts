import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import formidable from 'formidable';

import { db_req } from '../../lib/db_helper';
import { getCookie, GetProfileStatus } from '../../lib/auth_helper';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method != 'POST')
		return res.status(405).json({ status: 'error', error: 'Method not allowed' });

    let token = getCookie('token', req.headers.cookie);
    if (!token && !GetProfileStatus(token).isAdmin)
        return res.status(403).json({status: 'error', error: 'ERROR: FORBIDDEN.'});

    let productID = Number(req.query['id']);
    if(!Number.isSafeInteger(productID))
        return res.status(405).json({ status: 'error', error: 'Invalid ID' });

    
    try {
        await db_req('DELETE FROM products WHERE id = $1', [productID])
    } catch (error) {
        return res.status(500).json({ status: 'error', error: 'Datebase error' });
    }

    res.writeHead(301, { location: '/admin' });
    return res.end();
}
