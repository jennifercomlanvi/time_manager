/*
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/database.json')[env];

const sequelize = new Sequelize(config);


sequelize.authenticate().then(() => {

    console.log('Connection has been established successfully.');
}).catch(error => {

    console.error('Unable to connect to the database:', error);
});*/
const { DateTime } = require("luxon");

console.log(DateTime.now().ts)
console.log(DateTime.now().plus({ hours: 24 }).toJSDate());
