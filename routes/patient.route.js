const express = require('express')
const router = express.Router()
const patientModel = require('../models/patient.model')
const doctorModel = require('../models/doctor.model')
const consultationModel = require('../models/consultation.model')


router.post('/save-info', async (req, res) => {
  const { lookingFor, pastDiseases, location, sex, bloodGroup, weight, age } = req.body
  if (!lookingFor || !pastDiseases || !location || !sex || !bloodGroup || !weight || !age) return res.status(400).json({ error: 'All fields are required' })
  try {
    const newPatientInfo = await patientModel.create({ name: req.payload.name, email: req.payload.email, lookingFor, pastDiseases, location, sex, bloodGroup, weight, age })
    res.status(201).json({ alert: 'Your info saved successfully' })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.get('/get-doctors-info', async (req, res) => {
  try {
    const doctorsInfo = await doctorModel.findAll()
    res.status(200).json({ data: doctorsInfo })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.get('/get-consultations/:patientId', async (req, res) => {
  try {
    const consultation = await consultationModel.findAll({ order: [['date', 'ASC'],['time', 'ASC']] },
      { where: { patientId: req.params.patientId } })
    let todaysConsultations = [], upcomingConsultations = []
    for (let i = 0; i < consultation.length; i++) {
      if (consultation[i].dataValues.date.getDate() === new Date().getDate()) todaysConsultations.push(consultation[i].dataValues)
      if (consultation[i].dataValues.date.getDate() > new Date().getDate()) upcomingConsultations.push(consultation[i].dataValues)
    }
    res.status(200).json({ data:{todaysConsultations, upcomingConsultations}})
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.get('/get-past-consultations/:patientId', async (req, res) => {
  try {
    const consultation = await consultationModel.findAll({ order: [['date', 'DESC'], ['time', 'ASC']] },
      { where: { patientId: req.params.patientId } })
    let pastConsultations = []
    for (let i = 0; i < consultation.length; i++) {
      if (consultation[i].dataValues.date.getDate() < new Date().getDate()) pastConsultations.push(consultation[i].dataValues)
    }
    res.status(200).json({ data: pastConsultations })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.get('/give-rating/:doctorId', async (req, res) => {
  const { rating } = req.body
  if(!rating) return res.status(400).json({ error: 'Rating field is empty'})
  try {
    const doctor = await doctorModel.findAll({ where: { id: req.params.doctorId } })
    let updatedRatingSum = doctor[0].dataValues.ratingSum + rating
    let updatedPeopleRated = doctor[0].dataValues.peopleRated + 1
    const updatedDoctor = await doctorModel.update({ratingSum: updatedRatingSum, peopleRated: updatedPeopleRated}, { where: { id: req.params.doctorId } })
    res.status(200).json({alert: "Thank you for your rating"})
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


module.exports = router