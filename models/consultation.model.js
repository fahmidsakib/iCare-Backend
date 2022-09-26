const sequelize = require('../dbConfig')
const { DataTypes } = require('sequelize');

const consultationModel = sequelize.define('Consultation',
  {
    patientName: { type: DataTypes.STRING, allowNull: false },
    doctorName: { type: DataTypes.STRING, allowNull: false },
    patientEmail: { type: DataTypes.STRING, allowNull: false },
    doctorEmail: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Upcoming' },
    prescription: { type: DataTypes.TEXT, defaultValue: '' },
    date: { type: DataTypes.DATE, allowNull: false },
    cost: { type: DataTypes.INTEGER, allowNull: false },
    rated: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { timestamps: true, freezeTableName: true },
)
// consultationModel.sync({ force: true })
module.exports = consultationModel