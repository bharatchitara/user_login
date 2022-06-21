const logfunction3 = require('./login3.js');
const home = require('./home.js');
const auth = require("./authorization.js");   
const logout = require('./logout.js');               //middleware

// import * as f_logout from './logout.js';
// import * as logfunction3 from './login3.js';
// import * as home from './home.js';
// import * as auth from './authorization.js';
// import express from 'express';
// import bodyParser from 'body-parser';
// import { config } from 'dotenv';
// import cookieParser from 'cookie-parser';


const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const cookieParser = require('cookie-parser')


const PORT = process.env.API_PORT || 5000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express()
app.disable("x-powered-by");

app.use(cookieParser());

//routes
    // create server 
    app.listen(PORT, () => {
        console.log('Server is up and running on localhost:'+ PORT);
    });


    app.post('/login',urlencodedParser,logfunction3);                             //login page 
 
    app.get('/home',auth,home);                                         //home page - success after, JWT check pass

    app.post('/logout',urlencodedParser,logout);                                 //logout page


