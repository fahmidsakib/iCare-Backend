const sequelize = require('../dbConfig')
const { DataTypes } = require('sequelize');

const patientModel = sequelize.define('Patient',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.TEXT, allowNull: false },
    lookingFor: { type: DataTypes.TEXT, allowNull: false },
    bloodGroup: { type: DataTypes.STRING, allowNull: false },
    pastDiseases: { type: DataTypes.JSONB, allowNull: false },
    weight: { type: DataTypes.INTEGER, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    sex: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: true, freezeTableName: true },
)
// patientModel.sync({ force: true })
module.exports = patientModel