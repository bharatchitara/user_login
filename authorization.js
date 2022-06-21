const jwt = require("jsonwebtoken");
const store = require('store2');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');

const session  = require('./new_session.js');
const { response } = require("express");



var connection = mysql.createConnection({
  host : 'reusable-modules.ckphk93ofay7.us-east-1.rds.amazonaws.com',
  user : 'admin',
  password : 'Rmodules$2022#',
  database : 'micro_systems'

});


// import jwt from 'jsonwebtoken';
// import store from 'store2';
// import cookieParser from 'cookie-parser';

const config = process.env;

const verifyToken =  async(req, res, next) => {
  
  //const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies;
  const u_name = req.cookies['userid'];
  //const accesstoken = req.cookies['accesstoken'];
  // console.log(token);
  
  let fetchrefreshtoken;
  let fetchsession;   

  const get_user_email = u_name;

  
      try{
        
        fetchrefreshtoken = await session.fetchSessiondata(u_name,connection).then(result => result.values[0].token);
        fetchsession = await session.fetchSessiondata(u_name,connection).then(result => result.values[0].session_id);
       
        }

      catch(error){
        //console.log('User not exist');
        console.log(error);
        result = {success:false,msg:error}
        return result;
      }

      //console.log("the data is " +fetchrefreshtoken);

  
  if(!session){
    return res.status(401).send("no active session found against the user");
  }

  if(!fetchrefreshtoken){
    return res.status(403).send("No refresh token found, Please login again.");
  }

  try {
   // console.log(fetchrefreshtoken);
    const decoded = jwt.verify(fetchrefreshtoken, config.REFRESH_TOKEN_KEY);
    req.user = decoded;
    

  } catch (err) {
    console.log(err)
    return res.status(401).send("Invalid Token, authorization check failed. Please login again");
  }

  const accesstoken = jwt.sign(                                                             //jwt token creation and storing in user table
                {user_data:get_user_email},                                      // payload
                process.env.TOKEN_KEY,                                                           
                {
                  expiresIn: "1m",
                }
            );
  
  
  res.cookie('accesstoken',accesstoken);     


  return next();
};



module.exports = verifyToken;