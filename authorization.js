const jwt = require("jsonwebtoken");
const store = require('store2');
const config = process.env;

const cookieParser = require('cookie-parser')


const verifyToken = (req, res, next) => {
  
  //const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies;
  const token = req.cookies['JWT_token'];
  console.log(token);


  if (!token) {
    return res.status(403).send("A token is required for authentication, Please login again.");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;

    //console.log(req.user);
  } catch (err) {
    return res.status(401).send("Invalid Token,authorization check failed.");
  }
  return next();
};


module.exports = verifyToken;