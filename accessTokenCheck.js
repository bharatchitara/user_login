const jwt = require("jsonwebtoken");
const store = require('store2');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const session  = require('./new_session.js');



var connection = mysql.createConnection({
  host : 'reusable-modules.ckphk93ofay7.us-east-1.rds.amazonaws.com',
  user : 'admin',
  password : 'Rmodules$2022#',
  database : 'micro_systems'

});


const config = process.env;

const checkAccessToken = async (req,res,next) => {
  
    const token = req.body.token || req.query.token || req.headers['x-access-token']
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "error": true,
        "message": 'No token provided.'
    });
  }
}