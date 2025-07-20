// Basic Library Imports
import express, { json, urlencoded } from 'express';
import router from './src/routes/api.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import { connect } from 'mongoose';

const app=new express();

// Middleware

app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(json({ limit: "20MB" }));
app.use(urlencoded({extended: true}));
const limiter = rateLimit({ windowMs: 15*60*1000, max: 3000 });
app.use(limiter);

// MongoDB connection

let URL="mongodb+srv://rifat:1234@cluster0.jz0ux.mongodb.net/ClassTest"
let Option={user:'',pass:'',autoIndex:true}
connect(URL,Option).then(()=>{
    console.log("Database Connected")
}).catch((err)=>{
    console.log(err)
})

// API routes

app.use("/api", router);

// Serve static assets for React front end
app.use(express.static('client/dist'));


// Serve React front end for all routes not handled by the API
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client' , 'dist', 'index.html'));
});

export default app;