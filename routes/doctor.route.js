const express = require('express')
const router = express.Router()
const doctorModel = require('../models/doctor.model')
const patientModel = require('../models/patient.model')
const consultationModel = require('../models/consultation.model')



router.post('/save-info', async (req, res) => {
  const { qualification, experience, hospital, location, speciality, availableDay, availableTime, avgConsultationTime, cost } = req.body
  if (!qualification || !experience || !hospital || !location || !speciality || !availableDay || !availableTime || !avgConsultationTime || !cost) return res.status(400).json({ error: 'All fields are required' })
  try {
    const newDoctorInfo = await doctorModel.create({ name: req.payload.name, email: req.payload.email, qualification, experience, hospital, location, speciality, availableDay, availableTime, avgConsultationTime, ratingAndReview: [], cost })
    res.status(201).json({ alert: 'Your info saved successfully' })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.get('/get-patient-info/:patientId', async (req, res) => {
  try {
    const patientInfo = await patientModel.findAll({ where: { id: req.params.patientId } })
    res.status(200).json({ data: patientInfo })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})



router.get('/get-consultations/:doctorId', async (req, res) => {
  try {
    const consultation = await consultationModel.findAll({ order: [['date', 'ASC'], ['time', 'ASC']] },
      { where: { doctorId: req.params.doctorId } })
    let todaysConsultations = [], upcomingConsultations = []
    for (let i = 0; i < consultation.length; i++) {
      if (consultation[i].dataValues.date.getDate() === new Date().getDate()) todaysConsultations.push(consultation[i].dataValues)
      if (consultation[i].dataValues.date.getDate() > new Date().getDate()) upcomingConsultations.push(consultation[i].dataValues)
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
    const closedConsultation = await consultationModel.findAll({ order: [['date', 'DESC'], ['time', 'ASC']] },
      { where: { doctorId: req.payload.id, status: 'Closed' } })
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