const sequelize = require('../dbConfig')
const { DataTypes } = require('sequelize');

const authModel = sequelize.define('Auth',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    userType: { type: DataTypes.STRING, allowNull: false },
    resetPassCode: { type: DataTypes.STRING, defaultValue: '' }
  },
  { timestamps: true, freezeTableName: true },
)
// authModel.sync({ force: true })
module.exports = authModel