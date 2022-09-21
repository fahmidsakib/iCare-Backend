const express = require('express')
const router = express.Router()
const doctorModel = require('../models/doctor.model')
const patientModel = require('../models/patient.model')



router.post('/save-info', async (req, res) => {
  const { qualification, experience, hospital, location, speciality, availableDay, availableTime, avgConsultationTime, cost } = req.body
  if (!qualification || !experience || !hospital || !location || !speciality || !availableDay || !availableTime || !avgConsultationTime || !cost) return res.status(400).json({ error: 'All fields are required' })
  try {
    const newDoctorInfo = await doctorModel.create({ email: req.payload.email, qualification, experience, hospital, location, speciality, availableDay, availableTime, avgConsultationTime, ratingSum: 0, peopleRated: 0, cost })
    console.log(newDoctorInfo)
    res.status(201).json({ alert: 'Your info saved successfully' })
  } catch (error) {
    console.log(error)
    res.status(501).json({ error: error.message })
  }
})


router.get('/get-patient-info/:patientId', async (req, res) => {
  try {
    const patientInfo = await patientModel.findAll({where: {id: req.params.patientId }})
    res.status(200).json({ data: patientInfo })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})





module.exports = router