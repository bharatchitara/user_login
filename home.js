const jwt = require("jsonwebtoken");
const config = process.env;
const auth = require('./authorization.js');
const express = require('express');
const app = express()


//import jwt from 'jsonwebtoken';

 function home(req,res){
    //console.log("welcome");

    
    const token = req.cookies['accesstoken'];
    
    try{
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
        }
    
    catch(error){
        // console.log("the errr")
        // app.use(require('./accessTokenCheck'));
    }

    console.log(req.user)

    console.log(req.user.user_data)

    user_name = req.user.user_data
    res.status(200).json("Welcome home");

}

module.exports = home;
