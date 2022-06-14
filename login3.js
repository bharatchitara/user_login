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
const cookieParser = require('cookie-parser')


// var connection = mysql.createConnection({
//     host : 'reusable-modules.ckphk93ofay7.us-east-1.rds.amazonaws.com',
//     user : 'admin',
//     password : 'Rmodules$2022#',
//     database : 'micro_systems'

// });

const connection = mysql.createConnection({
    host : '127.0.0.1',
    port: '3306',
    user : 'root',
    password : 'Chits=1997',
    database : 'micro_systems'

});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });


async function login(req,response) {    
    //console.log("Hello ------------------",res.body)                                                         //login function
    response.status(200);
    var username = req.body.username
    var password = req.body.password

    if(!(username && password)){                                                           //check for username and password both are provided
        res.status(500).send('Please enter username and password');
    }

    var flag_user_exist = 0 ;
    var usr_index = 0;
    //length_users_object = Object.keys(users).length;

    u_name= '"'+username+'"';

    //var query_result = {};
    var db_password = '';
    
    try{

    const sql = `select * from users2 where email=${u_name}`;
    
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

    //console.log(output.msg[0].password);

    db_password = output.msg[0].password;
    console.log(output.msg);

    if(output.msg.length =!0){
        flag_user_exist = 1
    }

    verify_password = hashing.verify_password(password,db_password);

}

    catch
    {
        var message = [
            {
            "message": "service can't be reached"
        }
        ]

        response.status(302).json(message);
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
                                                                                                //secret
                {
                  expiresIn: "600s",
                }
            );


            var payload= [                                                                       //response payload
                {
                "name":get_user_name, 
                "email":get_user_email,
                "token":token 
                }
            ]

            
            response.cookie(`JWT_token`,token);                                                     //saving the token in cookies

            var message = [                                                                        //display message - for postman
            {
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
                "message": "Login failed", 
                }
            ]

            response.status(302).json(message);
        }
    }

    else{

        message = [
            {
            "message": "User not found", 
            }
        ]

        response.status(302).json(message);
    }      

                                                                                                // if true -> then hashed password check is success 
}

module.exports = login;


