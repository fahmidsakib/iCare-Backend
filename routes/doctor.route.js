const express = require('express')
const router = express.Router()
const doctorModel = require('../models/doctor.model')
const patientModel = require('../models/patient.model')
const consultationModel = require('../models/consultation.model')


router.get('/check-info', async (req, res) => {
  const doctor = await doctorModel.findAll({ where: { email: req.payload.email } })
  if (doctor.length === 0) return res.status(200).json({ data: undefined })
  else res.status(200).json({ data: doctor[0] })
})


router.post('/save-info', async (req, res) => {
  const { qualification, experience, hospital, location, speciality, availableDay, availableTime, avgConsultationTime, cost } = req.body
  if (!qualification || !experience || !hospital || !location || !speciality || !availableDay || !availableTime || !avgConsultationTime || !cost) return res.status(400).json({ error: 'All fields are required' })
  try {
    const newDoctorInfo = await doctorModel.create({ name: req.payload.name, email: req.payload.email, qualification, experience, hospital, location, speciality, availableDay, availableTime, avgConsultationTime, ratingAndReview: [], cost })
    res.status(201).json({ data: { payload: newDoctorInfo, alert: 'Your info saved successfully' } })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.post('/get-patient-info', async (req, res) => {
  const { email } = req.body
  try {
    const patientInfo = await patientModel.findOne({ where: { email: email } })
    res.status(200).json({ data: patientInfo })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.get('/get-patients-info', async (req, res) => {
  try {
    const patientsInfo = await patientModel.findAll()
    res.status(200).json({ data: patientsInfo })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.get('/get-consultations', async (req, res) => {
  try {
    const consultation = await consultationModel.findAll({ where: { doctorEmail: req.payload.email } }, { order: [['date', 'ASC'], ['time', 'ASC']] })
    let todaysConsultations = [], upcomingConsultations = []
    for (let i = 0; i < consultation.length; i++) {
      if (consultation[i].dataValues.date.getMonth() === new Date().getMonth() && consultation[i].dataValues.date.getDate() === new Date().getDate()) todaysConsultations.push(consultation[i].dataValues)
      if (consultation[i].dataValues.date.getMonth() >= new Date().getMonth() && consultation[i].dataValues.date.getDate() > new Date().getDate()) upcomingConsultations.push(consultation[i].dataValues)
    }
    res.status(200).json({ data: { todaysConsultations, upcomingConsultations } })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.get('/revenue', async (req, res) => {
  let start = new Date(req.query.start_date).getTime(), end = Date.now(), revenue = 0, selectedConsultations = []
  if (req.query.end_date !== undefined) end = new Date(req.query.end_date).getTime()
  try {
    const closedConsultation = await consultationModel.findAll({ where: { doctorEmail: req.payload.email, status: 'Closed' } }, { order: [['date', 'DESC'], ['time', 'ASC']] })
    for (let i = 0; i < closedConsultation.length; i++) {
      if (closedConsultation[i].dataValues.date.getTime() >= start && closedConsultation[i].dataValues.date.getTime() <= end) {
        revenue += closedConsultation[i].dataValues.cost
        selectedConsultations.push(closedConsultation[i].dataValues)
      }
    }
    res.status(200).json({ data: { selectedConsultations, revenue } })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


module.exports = router