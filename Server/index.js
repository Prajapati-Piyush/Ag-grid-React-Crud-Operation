import express, { urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(urlencoded(true))

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json({ success: true, message: "Api working...." })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})