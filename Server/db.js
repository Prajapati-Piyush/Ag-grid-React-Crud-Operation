import pkg from 'pg'
import dotenv from 'dotenv'

const {Pool} = pkg;
dotenv.config()

const pool= new Pool({
    connectionString: process.env.POSTRGRES_URI,
});


pool.on('connect',()=>{
    console.log("Connected to PostgreSqL Database")
})

export default pool;
