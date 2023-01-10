import * as dotenv from 'dotenv'
dotenv.config()

const host:any = process.env.HOST_MYSQL;
const port:any = process.env.PORT_MYSQL;
const user:any = process.env.USER_MYSQL;
const password:any = process.env.PASS_MYSQL;
const database:any = process.env.DB_MYSQL;

export const db_conex = {
    client: 'mysql2',
    connection: {
        host: host,
        port: port,
        user: user,
        password: password,
        database: database
    }
}