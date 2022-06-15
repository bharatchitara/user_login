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



//console.log(hash_password('RV90XO'))

//console.log(verify_password('RV90XO','$2b$10$SbutzzlmRp0.TV/1rqqyneuXV9TeOMN7jFsAoZbc0hLN2bsG8CjHi'));

module.exports.hash_password = hash_password;
module.exports.verify_password  = verify_password;

