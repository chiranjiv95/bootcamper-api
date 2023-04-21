const path=require('node:path');
const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const errorHandler=require('./middleware/error');
const colors=require('colors');
const fileUpload=require('express-fileupload');

// Load env vars
dotenv.config({ path: './config/config.env'});

// db
const connectDB=require('./config/db');

// Route files
const bootcamps=require('./routes/bootcamps');
const courses=require('./routes/courses');

const app=express();

// Body parser
app.use(express.json());

// Dev logging middleware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

// File uploading
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// error hander middleware
app.use(errorHandler);


const PORT=process.env.PORT || 3000;

const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`.yellow));
    } catch (error) {
        console.log(error)
    }
}

start();