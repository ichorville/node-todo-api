const { SHA256 } = require('crypto-js');

var message = 'I am number 4';
var hash = SHA256(message).toString();

console.log(`Message: ${ message }`);
console.log(`Hash: ${ hash }`);

// assumes the client send the below data to the server
var data = {
    id: 4 // want to acccess todos of user:4
};
// via the token, the data is hashed so that its unraedable and sent to the server
var token = {
    data, 
    // the 'somesecret' is a result of salting which alternates the data into 
    // something unreadable but dynamic everytime the client sends us something, where the 
    // later added text would change the format of the client data to something of a pattern 
    // we would expect from the server side.

    // hackers may have access to the data property of the token but since the hash is irreverseble,
    // the data remains safe
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

// some people may change the data of the token but the hash cannot ba altered

// at the server, the token including the client data is verified
var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
if (resultHash === token.hash) {
    console.log('Data was not changed');
} else {
    // if the data was changed the hash will be different but since we already expect what 
    // hash should be like, we can get an idea of whether the data is altered in the middleware
    console.log('Data was changed, Do not trust');
}



