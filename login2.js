const jwt = require('jsonwebtoken');
require("dotenv").config();
const hashing =  require('./password_hash.js');
const mysql = require('mysql');
const encryption_script = require('./cipher.js');
const utf8 = require('utf8');
const LocalStorage = require('node-localstorage');
const { stringify } = require('qs');
const { query } = require('express');
//LocalStorage = new LocalStorage('./scratch');


//local stored credentials, once the db is setup read from db and store the credentials in below format
users=     
            [
            {"username":"bharatc","password":"$2b$10$GdlL3.RDTCMAEa3YXRiM2OEj64zj6/uiXT5xWS4blSz4UcZl2aloW"},        //hashed password
            {"username":"test","password":"test1"},
            ]

data = [
        {"username":"bharatc", "name":"bharat"},
        {"username":"test","name":"test1"},
]


// var connection = mysql.createConnection({
//     host : 'reusable-modules.ckphk93ofay7.us-east-1.rds.amazonaws.com',
//     user : 'admin',
//     password : 'Rmodules$2022#',
//     database : 'micro_systems'

// });

var connection = mysql.createConnection({
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


function login(req,response) {    
    //console.log("Hello ------------------",res.body)                                                         //login function
    response.status(200);
    username = req.body.username
    password = req.body.password

    if(!(username && password)){                                                           //check for username and password both are provided
        res.status(500).send('Please enter username and password');
    }

    var flag_user_exist = 0 ;
    var usr_index = 0;
    length_users_object = Object.keys(users).length;

    u_name= '"'+username+'"';

    //var query_result = {};
    var db_password = '';
    
    

    sql = `select * from users2 where email=`+u_name;
    let result;
    connection.query(sql,function(err,res){
            if (err) throw err;
            console.log(res);

            if(res.length!=0){
                flag_user_exist = 1;
            }

            db_password = res[0].password;
            verify_password = hashing.verify_password(password,db_password);                             //verify the hashed password 
            console.log(verify_password);   
            
      
    if(flag_user_exist == 1 ){                                                                   // first check username is exist in local parameter/db
        
        if(verify_password == true){

            // var user_data_index = data.findIndex(obj => obj.username==username);                // find indexof username from json object
             var get_user_name = res[0].name;                                                      // fetch username and name from db/local stored 
             var get_user_username = res[0].username; 
             var get_user_email = res[0].email;
            
             const token = jwt.sign(                                                             //jwt token creation and storing in user table
                {user_data: get_user_name,get_user_username,get_user_email},                     // payload
                process.env.TOKEN_KEY,                                                           
                                                                                                //secret
                {
                  expiresIn: "1h",
                }
            );
            
            //data[user_data_index].token = token;                                                 //saving the jwt token 
            session_data = [

                {
                    id: 1,
                    session_id: token,
                    user_id: get_user_email,
                    login_time:'',
                    logout_time:'',
                    created_at:''

                }
            ];
            
            //sql = 'insert into sesssion values(?)',[JSON.stringify(session_data)])

            //connection.query('insert into sesssion values (?)',[JSON.stringify(session_data)]);

            //localStorage.setItem('token', data[user_data_index].token);

            var payload= [                                                                       //response payload
                {
                "name":get_user_name, 
                "email":get_user_email,
                "token":token 
                }
            ]
            
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
    
    });

                                                                                                // if true -> then hashed password check is success 


}

module.exports = login;


