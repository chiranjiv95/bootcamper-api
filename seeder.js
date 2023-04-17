const fs = require('node:fs');
const connectDB=require('./config/db');
const dotenv=require('dotenv');
const colors=require('colors');

// Load env vars
dotenv.config({path : './config/config.env'});

// Load models
const Bootcamp = require('./models/Bootcamp');

// Connect to DB
const URL=process.env.MONGO_URI
connectDB(URL);

// Read JSON files
const bootcamps=JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import into DB
const importData=async ()=>{
    try{
        await Bootcamp.create(bootcamps);
        console.log('Data imported...'.green.inverse);
        process.exit();
    }catch(err){
        console.log(err);
    }
}

// Delete data
const deleteData=async ()=>{
    try{
        await Bootcamp.deleteMany();
        console.log('Data destroyed...'.red.inverse);
        process.exit();
    }catch(err){
        console.log(err);
    }
}


if(process.argv[2]==='-i'){
    importData();
}else if(process.argv[2]==='-d'){
    deleteData();
}else{
    console.log('Not a valid command!')
}