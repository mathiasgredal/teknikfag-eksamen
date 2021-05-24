import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import formidable from 'formidable';

import { IUser } from '../../lib/auth_helper'
import { db_req } from '../../lib/db_helper'

// Disable the Next.JS bodyparser since we are using formidable, as it has support for file upload
export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST')
        return res.status(405).json({ status: 'error', error: 'Method not allowed' });

    let user_data: IUser = {
        id: undefined,
        username: undefined,
        registered: new Date(),
        password: undefined,
        isadmin: false
    };

    const form = new formidable.IncomingForm({
        uploadDir: "/tmp",
        keepExtensions: true
    });

    // We insert all the fields into user_data
    form.on('field', (field, value) => {
        if (field == "birthday")
            user_data[field] = new Date(value);
        else if (field == 'isadmin')
            user_data[field] = Boolean(value);
        else
            user_data[field] = value;
    })

    // We convert the recieved file into base64 and insert it into user_data
    // TODO: We should build a data storage system for this instead of using the database
    form.on('file', async (formname, file) => {
        if (formname == "profile_picture") {
            fs.readFile(file.path, { encoding: 'base64' }, async (err, data) => {
                if (err) {
                    res.status(400).json({ status: 'error', error: 'Could not read image' });
                    res.end();
                }
                user_data.profile_picture = data;
            });
        }
    })

    // This is called when all the fields have been parsed and files loaded
    form.on('end', async () => {
        // Are the necessary fields filled
        if (user_data.username == undefined || user_data.password == undefined)
            return res.status(400).json({ status: 'error', error: 'Request missing username or password' });

        // Check if user with this username exists
        if ((await db_req("SELECT * FROM users WHERE username = $1", [user_data.username])).rows.length != 0)
            return res.status(400).json({ status: 'error', error: 'User with this username already exists' });

        // Hash password
        user_data.password = await bcrypt.hash(user_data.password, 10);

        try {
            // First we insert the required data
            await db_req("INSERT INTO users (username, password, registered) VALUES ($1, $2, $3)", [user_data.username, user_data.password, new Date()])

            // Then we insert the optional data
            if (user_data.birthday != undefined)
                await db_req("UPDATE users SET birthday = $1 WHERE username = $2", [user_data.birthday, user_data.username])
	    if (user_data.country != undefined)
                await db_req("UPDATE users SET country = $1 WHERE username = $2", [user_data.country, user_data.username])
	    if (user_data.isadmin != undefined)
                await db_req("UPDATE users SET isadmin = $1 WHERE username = $2", [user_data.isadmin, user_data.username])
	    if (user_data.profile_picture != undefined)
                await db_req("UPDATE users SET profile_picture = $1 WHERE username = $2", [user_data.profile_picture, user_data.username])
        } catch (error) {
            return res.status(500).json({ status: 'error', error: 'Could not insert user into database' });
        }

        res.writeHead(301, { location: "/login" });
	return res.end();
    });

    // We parse the form
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(400).json({ status: 'error', error: 'Error parsing form' });
            return res.end();
        }
    });
};
