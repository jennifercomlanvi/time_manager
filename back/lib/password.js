const bcrypt = require('bcrypt');

async function hash(plaintextPassword) {
    return await bcrypt.hash(plaintextPassword, 10);
}

// compare password
async function compare(plaintextPassword, hash) {
    return await bcrypt.compare(plaintextPassword, hash);
}

module.exports = { hash, compare };
