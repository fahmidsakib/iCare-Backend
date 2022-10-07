const express = require('express')
const router = express.Router()
const patientModel = require('../models/patient.model')
const doctorModel = require('../models/doctor.model')
const consultationModel = require('../models/consultation.model')


router.get('/check-info', async (req, res) => {
  const patient = await patientModel.findAll({ where: { email: req.payload.email } })
  if (patient.length === 0) return res.status(200).json({ data: undefined })
  else res.status(200).json({ data: patient[0] })
})


router.post('/save-info', async (req, res) => {
  const { lookingFor, pastDiseases, location, sex, bloodGroup, weight, age } = req.body
  if (!lookingFor || !pastDiseases || !location || !sex || !bloodGroup || !weight || !age) return res.status(400).json({ error: 'All fields are required' })
  try {
    const newPatientInfo = await patientModel.create({ name: req.payload.name, email: req.payload.email, lookingFor, pastDiseases, location, sex, bloodGroup, weight, age })
    res.status(201).json({ data: { payload: newPatientInfo, alert: 'Your info saved successfully' } })
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


router.get('/get-consultations', async (req, res) => {
  try {
    const consultation = await consultationModel.findAll({ where: { patientEmail: req.payload.email } }, { order: [['date', 'ASC'], ['time', 'ASC']] })
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


router.get('/get-past-consultations', async (req, res) => {
  try {
    const consultation = await consultationModel.findAll({ where: { patientEmail: req.payload.email } }, { order: [['date', 'DESC'], ['time', 'ASC']] })
    let pastConsultations = []
    for (let i = 0; i < consultation.length; i++) {
      if (consultation[i].dataValues.date.getMonth() <= new Date().getMonth() && consultation[i].dataValues.date.getDate() < new Date().getDate()) pastConsultations.push(consultation[i].dataValues)
    }
    res.status(200).json({ data: pastConsultations })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.post('/give-rating', async (req, res) => {
  const { rating, review, consultationId, doctorEmail } = req.body
  if (!rating || !review) return res.status(400).json({ error: 'Both fields are required' })
  try {
    // const consultation = await consultationModel.findOne({ where: { id: consultationId } })
    const updateConsultation = await consultationModel.update({rated: true}, {where: {id: consultationId}})
    const doctor = await doctorModel.findAll({ where: { email: doctorEmail } })
    let copyRatingAndReview = JSON.parse(JSON.stringify(doctor[0].dataValues.ratingAndReview))
    let updatedRatingAndReview = copyRatingAndReview.concat([{ rating, review }])
    const updatedDoctor = await doctorModel.update({ ratingAndReview: updatedRatingAndReview }, { where: { email: doctorEmail } })
    res.status(200).json({ alert: "Thank you for your rating" })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.get('/check-available-slot/:doctorId/:date', async (req, res) => {
  let day = new Date(req.params.date).getDay(), date = new Date(req.params.date).getDate(), year = new Date(req.params.date).getFullYear(), availableSlot = []
  try {
    const doctor = await doctorModel.findOne({ where: { id: req.params.doctorId } })
    const consultation = await consultationModel.findAll({ where: { doctorEmail: doctor.dataValues.email } })
    for (let i = 0; i < doctor.dataValues.availableTime.length; i++) {
      let index = consultation.findIndex(el => el.time.includes(doctor.dataValues.availableTime[i]) && el.date.getDate() === date && el.date.getFullYear() === year)
      if (index === -1 && doctor.dataValues.availableDay[day]) availableSlot.push(doctor.dataValues.availableTime[i])
    }
    res.status(200).json({ data: availableSlot  })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


module.exports = router