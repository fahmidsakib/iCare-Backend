const express = require('express')
const router = express.Router()
const consultationModel = require('../models/consultation.model')



router.post('/book-consultation', async (req, res) => {
  const { patientId, doctorId, time, date, cost } = req.body
  console.log(patientId, doctorId, time, date, cost)
  if (!patientId || !doctorId || !time || !date || !cost) return res.status(400).json({ error: 'All fields are required' })
  try {
    const newConsultation = await consultationModel.create({ doctorId, time, date, patientId, cost })
    res.status(201).json({ alert: 'Your booking is successful' })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.get('/cancel-consultation/:consultationId', async (req, res) => {
  try {
    const updateConsultation = await consultationModel.update({ status: 'Canceled' },
      { where: { id: req.params.consultationId } })
    res.status(200).json({ alert: 'Booking canceled' })
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