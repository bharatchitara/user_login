const jwt = require('jsonwebtoken');
require("dotenv").config();
const hashing =  require('./password_hash.js');
const mysql = require('mysql');
const encryption_script = require('./cipher.js');
const utf8 = require('utf8');
const LocalStorage = require('node-localstorage');
const { stringify } = require('qs');
const { query } = require('express');
const store = require('store2');
const { resolve } = require('path');
const cookieParser = require('cookie-parser');
const session = require('./new_session.js');
const logout = require('./logout.js');


const res = require('express/lib/response');
var crypto = require('crypto');




var connection = mysql.createConnection({
    host : 'reusable-modules.ckphk93ofay7.us-east-1.rds.amazonaws.com',
    user : 'admin',
    password : 'Rmodules$2022#',
    database : 'micro_systems'

});

// const connection = mysql.createConnection({
//     host : process.env.MYSQL_HOST,
//     port: process.env.MYSQL_PORT,
//     user : process.env.MYSQL_USER,
//     password : process.env.MYSQL_PASSWORD,
//     database : process.env.MYSQL_DB

// });


async function login(req,response) {                                                          //login function

    //..............check connection 
    connection.connect(function(err) {    
        if (err) {
          //return console.error('error: ' + err.message);
          response.status(500).json("DB connection failed");
          return;
        }
      
        console.log('Connected to the MySQL server.');
    });
                                        
    response.status(200);
    var username = req.body.username
    var password = req.body.password

    if(!(username && password)){                                                           //check for username and password both are provided
        response.status(500).send('Please enter username and password');
    }

    var flag_user_exist = 0 ;
    var usr_index = 0;
    //length_users_object = Object.keys(users).length;

    var u_name= username;

    //var query_result = {};
    var db_password = '';

    var output;
    
    try{

    const sql = `select * from users where email="${u_name}"`;
    
    const result = await new Promise((resolve,reject) => {
        connection.query(sql,(err,res)=> {
            if(err){
                output = { success: false }
                reject(err.message);
            }
            else{
                resolve(res);
                output = {success : true, msg: res}
            }
        })
    })


    db_password = output.msg[0].password;
    console.log(output.msg);

    if(output.msg.length =!0){
        flag_user_exist = 1
    }

    verify_password = hashing.verify_password(password,db_password);
    if(verify_password == false){
        throw err;
    }
}

    catch
    {
        var message = [
            {
            "success": false,
            "message": "Login failed"
        }
        ]

        response.clearCookie('JWT_token');
        response.status(401).json(message);
       // connection.end();
        return;

    }

    if(flag_user_exist == 1 ){                                                                   // first check username is exist in local parameter/db
        
        if(verify_password == true){
             var get_user_name = output.msg[0].name;                                                      // fetch username and name from db/local stored 
             //var get_user_username = output.msg[0].username; 
             var get_user_email =  output.msg[0].email;
            
             const token = jwt.sign(                                                             //jwt token creation and storing in user table
                {user_data: get_user_name,get_user_email},                                      // payload
                process.env.TOKEN_KEY,                                                           
                {
                  expiresIn: "30m",
                }
            );

            const refreshToken = jwt.sign(
                {user_data: get_user_name,get_user_email}, 
                process.env.REFRESH_TOKEN_KEY, 
                { 
                    expiresIn: "60d",
                }
                );

            //console.log("from login"+refreshToken);
            var payload= [                                                                       //response payload
                {
                "name":get_user_name, 
                "email":get_user_email,
                "token":refreshToken 
                }
            ]

            
            response.cookie('userid',get_user_email);                                                     //saving the userid in cookies
           // response.cookie('accesstoken',token);                                                        //saving the token in cookies
           
            const inserttoken = await session.insertSession(u_name,refreshToken);
            console.log(inserttoken);


            var message = [                                                                        //display message - for postman
            {
                "success": true,
                "message": "Login successfull."
            }
        ]

        var encrypted_msg = encryption_script.encryption_f(JSON.stringify(payload))               //encrypting the payload @serve, needs to be decrypt @ client side.
        console.log(encrypted_msg)
        
        response.status(200).json(message);     
            
        }
        else{

            message = [
                {
                "success": false,
                "message": "Login failed", 
                }
            ]
            response.clearCookie('userid');
            response.status(403).json(message);
        }
    }

    else{

        message = [
            {
            "success": false,
            "message": "login failed", 
            }
        ]
        response.clearCookie('JWT_token');
        response.status(401).json(message);
    }      

  
//connection.end();                                                                           //closing the connection
}


module.exports = login;


