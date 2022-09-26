const express = require('express')
const router = express.Router()
const consultationModel = require('../models/consultation.model')



router.post('/book-consultation', async (req, res) => {
  const { patientEmail, doctorEmail, patientName, doctorName, time, date, cost } = req.body
  if (!patientEmail || !doctorEmail || !patientName || !doctorName || !time || !date || !cost) return res.status(400).json({ error: 'All fields are required' })
  try {
    const newConsultation = await consultationModel.create({ patientEmail, doctorEmail, patientName, doctorName, time, date, cost })
    res.status(201).json({ alert: 'Your booking placed successfully' })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.get('/cancel-consultation/:consultationId', async (req, res) => {
  try {
    const updateConsultation = await consultationModel.update({ status: 'Canceled' },
      { where: { id: req.params.consultationId } })
    res.status(200).json({ alert: 'Consultation canceled' })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.post('/close-consultation/:consultationId', async (req, res) => {
  const {prescription} = req.body
  try {
    const updateConsultation = await consultationModel.update({ status: 'Closed', prescription: prescription },
      { where: { id: req.params.consultationId } })
    res.status(200).json({ alert: 'Consultation Closed' })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


module.exports = router