import express  from "express";
import dotenv from 'dotenv'
import connectDatabase from "./config/dbconnect.js";
import error from "./middleware/error.js";
import flightRouter from "./route/flight.js"
import authRouter from "./route/user.js"
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express()
app.use(cors())

dotenv.config({ path : 'backend/config/config.env'})


//connect to database
connectDatabase()

app.get('/',(req,res)=>{
    res.json({
        message : 'hello'
    })
})

app.use(express.json())
app.use(cookieParser())
//routes

app.use('/api/v1',flightRouter)
app.use('/api/v1',authRouter)

// Middleware 
app.use(error)


app.listen(3000 , ()=>{
    console.log( `Server is run on 3000 `);
})

