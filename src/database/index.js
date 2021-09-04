const mongoose = require("mongoose");

async function initDatabase() {

    const url = `mongodb://localhost/dalilah-resto`;
    const initDB = new Promise((resolve, reject) => {

        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

        const db = mongoose.connection;
        db.on('error', (error) => {
            console.error('connection error:', error);
            reject(error);
        });
        db.once('open', function () {
            resolve(db);
        })
    })

    return initDB;
}

module.exports = {
    initDatabase
}