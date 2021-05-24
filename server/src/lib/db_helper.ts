import { Client, QueryResult } from 'pg';

const client = new Client({
    user: 'postgres',
    host: process.env.DB_HOST? process.env.DB_HOST : 'localhost',
    database: 'webshop',
    password: 'postgres',
    port: 5432,
});

client.connect();

export async function db_req(query: string, values?: any) : Promise<QueryResult<any>> {
    try {
        return client.query(query, values);
    } catch (error) {
        throw error;
    }
}
