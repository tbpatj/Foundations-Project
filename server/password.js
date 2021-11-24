const bcrypt = require('bcrypt');

module.exports = {
    hashPassword: password => {
        let salt = bcrypt.genSaltSync(5);
        let saltedHash = bcrypt.hashSync(password,salt);
        return saltedHash;
    },
    checkPassword: (password,hashedPassword) => {
        let containsHash = bcrypt.compareSync(password,hashedPassword);
        if (containsHash) {
            return true;
        } else {
            return false;
        }
    }
}