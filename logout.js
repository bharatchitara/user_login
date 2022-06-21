// import * as updatesessions from './new_session.js';

const updatesessions = require('./new_session.js');
const mysql = require('mysql');


var connection = mysql.createConnection({
    host : 'reusable-modules.ckphk93ofay7.us-east-1.rds.amazonaws.com',
    user : 'admin',
    password : 'Rmodules$2022#',
    database : 'micro_systems'

});



async function logout(req,response) {                                                          //logout

    var username = req.body.username;
   // console.log(username);
    var msg;

   // const user_id = await updatesessions.getUserID(username).then(result => result.values[0].id);
    try{
       const result = await updatesessions.updateSessiondataFromDb(username,connection,0);

        console.log(result);
       
       msg = {
        success: true,
        message:"user logged-out success"

    }

    }
    catch(error){
        console.log('user logout failed');
        console.log(error);
        msg = {
            success: false,
            message:"user logout failed"

        }

    }


    response.status(200).json(msg);

    
}

module.exports = logout;