const pg = require('pg');
require('dotenv').config()

const conString = process.env.URL
const client = new pg.Client(conString);

module.exports = client