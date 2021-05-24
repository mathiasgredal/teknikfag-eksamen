import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import formidable from 'formidable';

import { db_req } from '../../lib/db_helper'
import { getCookie, GetProfileStatus } from '../../lib/auth_helper';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST')
        return res.status(405).json({ status: 'error', error: 'Method not allowed' });

    console.log(req.query['id']);
    let id = Number(req.query['id']);
    let quantity = Number(req.body['quantity']);

    if(!Number.isSafeInteger(id))
        res.status(400).json({ status: 'error', error: 'Invalid ID in query params' });

    if(!Number.isSafeInteger(quantity))
        res.status(400).json({ status: 'error', error: 'Invalid quantity in POST body' });

    try {
        let stockRows = (await db_req("SELECT stock FROM products WHERE id = $1", [id])).rows

        if(stockRows.length == 0)
            res.status(400).json({ status: 'error', error: 'Selected product does not exist' });

        let stock = Number(stockRows[0]['stock']) - quantity;

        db_req("UPDATE products SET stock = $1  WHERE id = $2", [stock, id])
    } catch (error) {
        res.status(400).json({ status: 'error', error: 'Datebase error' });
    }


    res.writeHead(301, { location: req.headers.referer });
    return res.end();
};
