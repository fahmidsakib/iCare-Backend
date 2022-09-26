require('dotenv').config()
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.URL, {dialect: 'postgres'});

module.exports = sequelize