const bcrypt = require('bcrypt');


function hash_password(password){                                      //hash the password , this method is for registration
    
    hashed_passwd = bcrypt.hashSync(password,10);
  // console.log(hashed_passwd)
    return hashed_passwd


}

function verify_password(user_given_password,dbstored_password){                     // verifiy the password for login 

    verify_passwd = bcrypt.compareSync(user_given_password,dbstored_password);
  //  console.log(verify_passwd)
    return verify_passwd
}



//console.log(hash_password('2CmDxHCEL'))

//console.log(verify_password('2CmDxHCEL','$2b$10$ZKl.1vZK.6Sxbvz9/5FvQ.N78gXYEIZMAuAQBUqRoCyKB0CgObfNW'));

module.exports.hash_password = hash_password;
module.exports.verify_password  = verify_password;

