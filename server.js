const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');

// Load env vars
dotenv.config({ path: './config/config.env'});

// db
const connectDB=require('./config/db');

// Route files
const bootcamps=require('./routes/bootcamps');

const app=express();

// Body parser
app.use(express.json());

// Dev logging middleware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);


const PORT=process.env.PORT || 3000;

const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`));
    } catch (error) {
        console.log(`Someting went wrong!`)
    }
}

start();