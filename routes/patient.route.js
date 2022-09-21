const express = require('express')
const router = express.Router()
const patientModel = require('../models/patient.model')
const doctorModel = require('../models/doctor.model')
const consultationModel = require('../models/consultation.model')


router.post('/save-info', async (req, res) => {
  const { lookingFor, pastDiseases, location, sex, bloodGroup, weight, age } = req.body
  if (!lookingFor || !pastDiseases || !location || !sex || !bloodGroup || !weight || !age) return res.status(400).json({ error: 'All fields are required' })
  try {
    const newPatientInfo = await patientModel.create({ email: req.payload.email, lookingFor, pastDiseases, location, sex, bloodGroup, weight, age })
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


router.post('/book-consultation', async (req, res) => {
  const {doctorId, time, date} = req.body
})



module.exports = router