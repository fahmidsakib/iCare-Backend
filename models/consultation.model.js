require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.URL);

const consultationModel = sequelize.define('Consultation',
  {
    patientId: { type: DataTypes.INTEGER, allowNull: false },
    doctorId: { type: DataTypes.INTEGER, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: true, defaultValue: 'Upcoming' },
    prescription: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
    date: { type: DataTypes.DATE, allowNull: false}
  },
  { timestamps: true, freezeTableName: true },
)
consultationModel.sync({ force: true })
module.exports = consultationModel