//const logfunction2 = require('./login2.js');
const logfunction3 = require('./login3.js');
const home = require('./home.js');
const auth = require("./authorization.js");                  //middleware

const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const cookieParser = require('cookie-parser')




var PORT = process.env.API_PORT || 5000;

var urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express()

app.use(cookieParser());

//routes
    // create server 
    app.listen(PORT, () => {
        console.log('Server is up and running on localhost:'+ PORT);
    });


    app.post('/login',urlencodedParser,logfunction3);

    app.get('/home',auth,home);

//logfunction('test','test1');

