require('dotenv').config();
const mongoose = require ("mongoose");

const URI = `${process.env.URI}`;
// console.log("URI",`${process.env.URI}`); 

const connectToDb = async() =>{
    try{
        await mongoose.connect(URI);
        console.log("Connection Successful"); 
        // console.log("hello");
    }catch(error){
        console.log("Database connection failed", error);
        process.exit(0);
    }
}

//Configured DB//

module.exports = connectToDb;