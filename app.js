const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const bodyParser = require('body-parser');
const app = express();

app.use(cors(
    {
        // origin: ["https://your-frontend-domain.vercel.app" || "http://localhost:3999/"],
        // methods: ["GET", "POST", "PUT", "DELETE"],
        origin: "*",
        credentials: true
    }
    ));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());

// app.post("/api/v1/ratings", (req, res)=>{
//     return res.status(200).json("Hit Route");
// });
    

module.exports = { app };