import express from "express";
import cors from 'cors'
import morgan from 'morgan'
import connect from "./db/connect.js";
import ENV from './config.js'
import UserRouter from "./router/user.router.js";
import adminRouter from "./router/admin.router.js";

const app = express();



//middleware
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.disable('x-powered-by')

//router
app.use('/api', UserRouter)
app.use('/api', adminRouter)


const port = ENV.PORT || 3001;



connect().then(() => {
    app.get('/', (req, res) => {
        res.status(200).json("Server started at port " + port);
    })
    app.listen(port, (req, res) => {
        console.log("Server started at port " + port)
    })
}).catch(e => console.log(e));