require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.URL);

const doctorModel = sequelize.define('Doctor',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false},
    qualification: { type: DataTypes.TEXT, allowNull: false },
    experience: { type: DataTypes.TEXT, allowNull: false },
    hospital: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.TEXT, allowNull: false },
    speciality: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    availableDay: { type: DataTypes.ARRAY(DataTypes.BOOLEAN), allowNull: false },
    availableTime: { type: DataTypes.JSONB, allowNull: false },
    avgConsultationTime: { type: DataTypes.INTEGER, allowNull: false },
    ratingSum: { type: DataTypes.INTEGER, allowNull: false },
    peopleRated: { type: DataTypes.INTEGER, allowNull: false },
    cost: { type: DataTypes.INTEGER, allowNull: false }
  },
  { timestamps: true, freezeTableName: true },
)
// doctorModel.sync({ force: true })
module.exports = doctorModel