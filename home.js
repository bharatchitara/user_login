const jwt = require("jsonwebtoken");
const config = process.env;

function home(req,res){
    //console.log("welcome");

    const token = req.cookies['JWT_token'];
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;

    //console.log(req.user)

    //console.log(req.user.user_data)

    user_name = req.user.user_data
    res.status(200).json("Welcome home " +user_name);

}

module.exports = home;