import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

connectDB();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('API is running 🚀'))

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
