const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

const david = nacl.box.keyPair();
const viktoria = nacl.box.keyPair();


function encryption_f(plain_text){
    //David computes a one time shared key
    const david_shared_key = nacl.box.before(viktoria.publicKey,david.secretKey);

    //David also computes a one time code.
    const one_time_code = nacl.randomBytes(24);


    //Getting the cipher text
    const cipher_text = nacl.box.after(
        nacl.util.decodeUTF8(plain_text),
        one_time_code,
        david_shared_key 
    );

    //message to be transited.
    const message_in_transit = {cipher_text,one_time_code};

    return message_in_transit;
}


//encrpted_msg = encryption_f('2CmDxHCEL');
//console.log(encrpted_msg);




function decryption_f(message){
    //Getting Viktoria's shared key
    const viktoria_shared_key = nacl.box.before(david.publicKey,viktoria.secretKey);

    //Get the decoded message
    let decoded_message = nacl.box.open.after(message.cipher_text,message.one_time_code,viktoria_shared_key);

    //Get the human readable message
    return (nacl.util.encodeUTF8(decoded_message))

}

//decrypted_msg = decryption_f(encrpted_msg);
//console.log(decrypted_msg);

module.exports.encryption_f = encryption_f;
module.exports.decryption_f = decryption_f;

