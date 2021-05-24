import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import formidable from 'formidable';

import { getCookie, GetProfileStatus, IUser } from '../../lib/auth_helper'
import { db_req } from '../../lib/db_helper'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET')
        return res.status(405).json({ status: 'error', error: 'Method not allowed' });
    let image = "/9j/4AAQSkZJRgABAQEASABIAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gNzUK/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgA3ADcAwEiAAIRAQMRAf/EABsAAQACAwEBAAAAAAAAAAAAAAABBgIEBQMH/8QALhABAAIBAwMDAwMDBQAAAAAAAAECAwQFESExQRITUSJhcTJSgSNykSQ0QrHx/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAMEAQL/xAAfEQEAAwEAAwEBAQEAAAAAAAAAAQIRAyExQRJREyL/2gAMAwEAAhEDEQA/APv4AAAAAAAEogmejX1Gqx6enqvbr8GTLkzENiWvm1eHD+u8RLhavd8uaZri6Uc6bTaeZmZ/levH+pW6fxYcm+YKTxWJt+Hhbf8Ar0wdPy4gp/lCf+ku5Xfomfqw8R9pbOLetNfpafT+VaHJ5Q7HWVyw58WaOcd4l68qVjy3xW5x2mJ/LraTepraKaiPxKVuU/Fa9Id9LzxZKZaxasxMPRHJhQAdAAAAAAAAAAAABEjx1WeunxTktPYjzPhyZyHhrtdTSYp7TfxCtZ9Rk1GSbXmZ58Gp1FtTntkt2ns8mrnSIjyy2vso4SCryAAAAdPJ+QHG3otdk0mXiLc0/as2DUU1GKL06/KndJ6t3bdbbS5Yjn+naesIdKfVed5WqJSwx2i9YtXtLNnaQAAAAAAAAAAAGPhXd61fuZvYjtDvajJ7eC9/iFPy2nJltee9p5V5V+o9LMfIcDUzgA6AAAAAAHPHPyHB4cWHZtV7mH2bfqq63XhU9tzezrKfFp4la4nmOYZOtclq522GQjlKagAAAAAAAAADnbvkmmhmP3TwrELDv8/6On96veGrjHhm6+wBVIAHQAAAAAAAE1t6b1t5iVx09vXgpbnvCm+Vt2//AGGL8Id1uPttJQlnWgAHQAAAAAAAHJ32nq0VZ+Lcq6tm5Y/c0WSOOZiOip9ojlp4z4Z+seQBZIAAAAAAAAAA/wDFv0UenR44jtEKngp7uopSOvMrhjr6McU8RDP3lblD0ShKC4AAAAAAAAADC9fVWaz2mFR1uGcGqvWY6c8wuDkb1opy4vdp+qvf8KcrZOJ3rsK9HP8ACTvETx/A1swAAAAAAAAnv27ITWs3vFKx1sT4I8ujs+n93Ue5MdKrLw1Nv00abTVrP6vLbY+lts1UjKiQeHsAAAAAAAAABCLViazExzyyQQKzuW320+WclI+ie/2c7xyumSlclJreImsq/uG1ZMdpvhjmnw0U6/JQvy+w5YemYnrEx9jrz9l0IAB0AAEd+ssqUvltEY6zMm4ZqI69nd2nbppPvZa/VPaJNu2iKTGXP1v8OzEREcRHDP06b4hfnz+piOOwJQWAAAAAAAAAAAAAOQRwiYjtwlEzERzMkQa0NVtWHUczX6LT5hyM2z6jDP0RF6/Lu59dp8MT68kfiHOy77SOmLHM/eVaWvCVoq41sV6Txalon8MOsd4dHJvGe8THppx/a151l7T+mn+F4tZH8w14i0+HpTT5cs8Ux3n+HrTX5KW5itP8NvHvmSv68dZj7dHLWs7Fao0+yZ8vXNPtx9nZ0ugw6aI9NYmflq4N7wZOlo9E/wCW/iz4ssfReJQtN1qxV6hynlNQAAAAAAAAAABAJEEhByjlE2isTMz2cbcN3ivOPDPX5h2tZly1ohv6vccWmrPMxa3w4eq3XPnmYr9Nfs0rWtefVaeZljHRppziPbPa++kzNrdZmbfeZQeRXf4nsgBDmAAYjjq9MebJitE0vMSwDInw7uOzpd6tTpqK9PmHaxZ6ZqRalolTOOvL302rzaS8WpMzXzCN+X8Vp0z2uEJaOj3DHq6RxPF/MNznx5ZpiYnJXidjWQhI6AAAAAAISAjnhje0REzM8RHlMuFuu49fYxz08zD1Sv6l5tb8sNy3O2WZxYp4rHeY8uT55I468d5GutYhmtaZP5Ae3gAcdAAAAAAADDcZY8l8WSL0niY+PKybfuFdTjit+mSFZ54ZYsl8N/XSfq+Hi9ItGQ9UtMeV1IaWg1ldXij90d27E8scx+Zxqif1GpAHQAAABEJeWXJGLHN5npWOpmyTONLddbGmxemJ+u0K1M+qeZ7z1e2q1FtTqLZLdv8Ai8P+2vnXIZbzsgCjwAAAAAAAAAAAAAEe3J9PfSam2kzVvWZ4mfqhbMWWubFF6TzEqXx3+/d2Nn1nov7FpnieyPXnvlbnbPCweUogZmiEgAAiQS4e+arikaek9bdbOxlvGPHe0z0iFR1Wf39Te/yryrs6l0tnh48x47QEdhrZwBwAAAAAAAAAAAAABwTW8471vWesSg7dXMd9LdotRGo01bx346tlXtk1PpzTgntKw92O9clqpbYSEDy9iJT4Yz4c+jmbzqPb0npjvaVcdHes05NXNOelHObOUZDL0nZAFHgAAAAAAAAAAAAAAAAAHHpgyThzVvHflcMOSMmOto7WjlS1l2bNOTRREz1r0Q61+r8p+OlCUQlnXGF7RWs2nxDNrayeNNlmP2yRHlyfSq6m/u6rLb5l5E94kbo9Mc+wB0AAAAAAAAAAAAAAAAAHYcHY2LLEZrY58w47d2q0xrqceeid42sqVn/qFpr0hkiEsbU//9k="

    if(req.query['id']) {
        let db_request = await db_req("SELECT profile_picture FROM users WHERE id = $1", [req.query['id']]);
        image = db_request.rowCount > 0 && db_request.rows[0].profile_picture? db_request.rows[0].profile_picture : image
    }
    else {
        let token = getCookie("token", req.headers.cookie);
        if (token) {
            let profile = GetProfileStatus(token);
            let db_request = await db_req("SELECT profile_picture FROM users WHERE username = $1", [profile.username]);
            image = db_request.rowCount > 0 && db_request.rows[0].profile_picture ? db_request.rows[0].profile_picture : image
        }
    }

    // Return the image as binary data
    res.setHeader('Content-Type', 'image/jpg');
    res.send(Buffer.from(image, 'base64'));
};