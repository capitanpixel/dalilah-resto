const mongoose = require("mongoose");
const dotenv = require("dotenv");

async function initDatabase() {

    dotenv.config();
    const DB_USERNAME = process.env.DB_USERNAME;
    const DB_PASSWORD = process.env.DB_PASSWORD;
    const DB_DATABASE = process.env.DB_DATABASE;

    const url = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@dalilah.abewh.mongodb.net/${DB_DATABASE}?retryWrites=true&w=majority`;
    
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