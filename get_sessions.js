var crypto = require('crypto');
const mysql = require('mysql');
const { NULL } = require('mysql/lib/protocol/constants/types');
require("dotenv").config();


const connection = mysql.createConnection({
    host : process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DB

});


var generate_session_key = function(){
    return crypto.randomBytes(8).toString('base64');
};

console.log(generate_session_key());

let ts = new Date();
date= ts.getDate();
month = ts.getMonth();
year = ts.getFullYear();

full_date = date+'/'+month+'/'+year;

async function session(username) {                                                          //get sessions details

    var u_name = username;
    u_name = '"'+u_name+'"' 

    var id_from_users;





    
    try{
        const get_users_id = `select id from users2 where email=${u_name}`;
        console.log(get_users_id);

        const result = await new Promise((resolve,reject) => {
            connection.query(get_users_id,(err,res)=> {
            
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

        console.log(output.msg[0].id);
        id_from_users = output.msg[0].id;

        if(output.msg !== NULL){
            console.log(output.msg);
        }
        else{
            var falg = 1;
            console.log(falg);
        }



    }

    catch{

    }

    if(id_from_users!=[]){

    try{

    var id_from_session =  id_from_users;
    
    const get_session_sql = `select * from sesssion where user_id=${id_from_session}`;
    console.log(get_session_sql);
    
    const result = await new Promise((resolve,reject) => {
        connection.query(get_session_sql,(err,res)=> {
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

    console.log(output.msg);

    }
    catch{

        return;
    }
    
    }
    else{

    }


    var get_query= `select max(id) from sesssion`;

        const get_id = await new Promise((resolve,reject) => {
            connection.query(get_query,(err,res)=> {
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

        console.log(output.msg);

    if(output.msg.length!= 0){
        const id = output.msg;
        const session_id = generate_session_key;
        const user_id = username;
        const login_time = full_date;
        const logout_time = '';
        const token= ''; 

        console.log(id);


    
    }
    else{

        const id = '1';
        const session_id = generate_session_key;
        const user_id = username;
        const login_time = full_date;
        const logout_time = '';
        const token= ''; 

        var insert_query= `insert into sesssion values(${id},${session_id},${user_id},${login_time},${logout_time},${token})`;

        const get_id = await new Promise((resolve,reject) => {
            connection.query(insert_query,(err,res)=> {
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


    }


}

session('mmacgaughey0@discovery.com3');


