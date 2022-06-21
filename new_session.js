const { rejects } = require('assert');
var crypto = require('crypto');
const { builtinModules, Module } = require('module');
const mysql = require('mysql');
const { resolve } = require('path');
require("dotenv").config();


// import { rejects } from 'assert';
// import crypto from 'crypto';
// import mysql from 'mysql';
// import { resolve } from 'path';
// import { config } from 'dotenv';



var connection = mysql.createConnection({
    host : 'reusable-modules.ckphk93ofay7.us-east-1.rds.amazonaws.com',
    user : 'admin',
    password : 'Rmodules$2022#',
    database : 'micro_systems'

});



// var connection = mysql.createConnection({
//     host : process.env.MYSQL_HOST,
//     port: process.env.MYSQL_PORT,
//     user : process.env.MYSQL_USER,
//     password : process.env.MYSQL_PASSWORD,
//     database : process.env.MYSQL_DB

// });

const generate_session_key = async function(){
    return crypto.randomBytes(8).toString('base64');
};



async function getUserID(username) {                                                          //getuserfromdb function
    let result;
    const u_name = username;
    const query = `select id from users where email="${u_name}"`;
    //const query = `select id from users2 where email="${u_name}"`;

    console.log(query);
    

    try{
        const response  = await new Promise((resolve,reject) =>{
            connection.query(query,(err,results) =>{
                if(err){
                    result = {success:false, msg:err}
                    reject(err.message);
                }
                else{
                    resolve(results);
                    console.log(results);
                    if(results.length ==0)
                        result = {success:false,msg:"user not found",values: results}
                    else
                        result =  {success:true,msg:"user fetched ",values: results}
                }
        })
    })

}
catch(error){
    console.log("error is getUserId",error);
    result = {success:false,msg:error}
}
    return result;
}



async function insertSession(username,refreshtoken){
    let result;

    const u_name = username;
    const ref_token = refreshtoken;

    console.log("refresh token is "+refreshtoken);
    console.log("reftoken is " +ref_token);

    const generate_session_id = await generate_session_key().then(result);
    
    let user_id;

    try{
        user_id = await getUserID(u_name).then(result => result.values[0].id);
       // user_id = await getUserID(u_name);
      
        console.log("the user is "+user_id);   
        }

    catch(error){
        console.log('User not exist');
        result = {success:false,msg:error}
        return result;
    }

    var currentdate;
    currentdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(currentdate);
    console.log(ref_token);
    const query  = `insert into sessions (session_id,user_id,login_time,token) values ('${generate_session_id}','${user_id}','${currentdate}','${ref_token}')`;
//    const query  = `insert into sessions (session_id,user_id,login_time) values ('${generate_session_id}','${user_id}','${currentdate}')`;
//     const query  = `insert into session (session_id,user_id,login_time) values ('${generate_session_id}','${user_id}','${currentdate}')`;


    try{
        const response  = await new Promise((resolve,reject) =>{
            connection.query(query,(err,results) =>{
                if(err){
                    result = {success:false, msg:err}
                    reject(err.message);
                }
                else{
                    resolve(results);
                    if(results.length ==0)
                        result = {success:false,msg:"session not inserted",values: results}
                    else


                     //// ending any previous session
                    try{
                        const updateprevioussession = updateSessiondataFromDb(username,connection,1);
                 
                        msg = {
                         success: true,
                         message:"previous session ended."
                 
                        }
                 
                     }
                     catch(error){
                         console.log('previous session not ended.');
                         console.log(error);
                         msg = {
                             success: false,
                             message:"previous session not ended."
                 
                         }
                 
                     }
                    ////

                        result =  {success:true,msg:"session inserted",values: results}
                }
        })
    })

} 

catch(error){
    console.log("session table insertion failed",error);
    result = {success:false,msg:error}
}
       console.log(result);
       return result;
}


//insertSession('ps@test.com','1234');
//connection.end();


async function getSessiondataFromDb(username){
    let result;

    const u_name = username;
    //const ref_token = refreshtoken;

    //const generate_session_id = await generate_session_key().then(result);
    

    try{
        user_id = await getUserID(u_name).then(result => result.values[0].id);
        console.log("the user is "+user_id);   
        }

    catch(error){
        console.log('User not exist');
        result = {success:false,msg:error}
        return result;
    }

    const query = `
    select se.user_id,se.login_time from sessions as se inner join users as us 
    on se.user_id = us.id where logout_time is null and login_time = 
    (select max(login_time) from sessions where user_id = (select distinct id from users where id = "${u_name}"))`;

    try{
        const response  = await new Promise((resolve,reject) =>{
            connection.query(query,(err,results) =>{
                if(err){
                    result = {success:false, msg:err}
                    reject(err.message);
                }
                else{
                    resolve(results);
                    if(results.length ==0)
                        result = {success:false,msg:"user not exist",values: results}
                    else
                        result =  {success:true,msg:"user fetched",values: results}
                }
        })
    })

} 

catch(error){
    console.log("session table insertion failed",error);
    result = {success:false,msg:error}
}
       console.log(result);
       return result;
}



async function updateSessiondataFromDb(username,db_connection,to_update_previous_session){
    let result;

    let flag_is_previous_session  = to_update_previous_session;                          // if val - 1 , then to update previous session logout time, at the time of login. 
    connection = db_connection;

    const u_name = username;
    
    let user_id;

    var currentdate;
    currentdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(currentdate);

    try{
        //console.log(u_name);
        user_id = await getUserID(u_name).then(result => result.values[0].id);
        console.log("the user is "+user_id);   
        }

    catch(error){
        console.log('User not exist');
        result = {success:false,msg:error}
        return result;
    }

    let query;

    if (flag_is_previous_session == 1 ){
        query = `update sessions set logout_time = "${currentdate}" 
                    where user_id = "${user_id}" and id = (select * from(select max(id)-1 

                    from sessions where user_id = "${user_id}") temptable)`;

    }

    else{
    query = `update sessions set logout_time = "${currentdate}" 
                    where user_id = "${user_id}" and id = (select * from(select max(id) 
                    from sessions where user_id = "${user_id}") temptable)`;
    }

    try{
        const response  = await new Promise((resolve,reject) =>{
            connection.query(query,(err,results) =>{
                if(err){
                    result = {success:false, msg:err}
                    reject(err.message);
                }
                else{
                    resolve(results);
                    if(results.length ==0)
                        result = {success:false,msg:"session update failed",values: results}
                    else
                        result =  {success:true,msg:"session update success",values: results}
                }
        })
    })

} 

catch(error){
    console.log("session updation failed",error);
    result = {success:false,msg:error}
}
       console.log(result);
       return result;
}


async function fetchSessiondata(username,db_connection){

    let result;
    connection = db_connection;
 
    const query = `
    select session_id, token from sessions where id = (select max(id) from sessions) and logout_time is null;`;

        try{
        const response  = await new Promise((resolve,reject) =>{
        connection.query(query,(err,results) =>{
        if(err){
          result = {success:false, msg:err}
          reject(err.message);
        }
        else{
          resolve(results);
          if(results.length ==0)
              result = {success:false,msg:"query failed",values: results}
          else
              result =  {success:true,msg:"query passed",values: results}
        }
        })
        })

        } 

        catch(error){
        console.log("session updation failed",error);
        result = {success:false,msg:error}
        }


        return result;

}




//export default { getUserID, insertSession, getSessiondataFromDb, updateSessiondataFromDb};

//module.exports = getUserID,insertSession,getSessiondataFromDb, updateSessiondataFromDb;

module.exports.insertSession= insertSession;
module.exports.getUserID = getUserID;
module.exports.getSessiondataFromDb= getSessiondataFromDb;
module.exports.updateSessiondataFromDb = updateSessiondataFromDb;
module.exports.fetchSessiondata = fetchSessiondata;




