var bcrypt = require('bcryptjs');

var password = '123abc';

bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, (error, hash) => {
        console.log(hash);
    });
});

var hashedPAssword = '$2a$10$f6ftu8fArlFLMtk0.nhGGeORwXToqn8CKSy1.VGk3ri61INPSF3TO';

bcrypt.compare(password, hashedPAssword, (error, response) => {
    console.log(response);
});