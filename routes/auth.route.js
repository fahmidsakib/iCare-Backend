require('dotenv').config()
const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const formData = require('form-data')
const Mailgun = require('mailgun.js')
const mailgun = new Mailgun(formData)
const authModel = require('../models/auth.model')



router.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword, userType } = req.body
  if (!name || !email || !password || !confirmPassword || !userType) return res.status(400).json({ error: 'All fields are required' })
  const existingUser = await authModel.findAll({ where: { email: email.toLowerCase() } })
  if (existingUser.length !== 0) return res.status(400).json({ error: 'Email already exists' })
  if (password !== confirmPassword) return res.status(400).json({ error: 'Password does not match' })
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  try {
    const newUser = await authModel.create({ name, email: email.toLowerCase(), password: hash, userType })
    res.status(201).json({ alert: 'Signup Successful, Please login to your account' })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Both fields are required' })
  const existingUser = await authModel.findAll({ where: { email: email.toLowerCase() } })
  if (existingUser.length === 0) return res.status(400).json({ error: 'User does not exists' })
  const passwordCheck = bcrypt.compareSync(password, existingUser[0].dataValues.password)
  if (passwordCheck) {
    let payload = JSON.parse(JSON.stringify(existingUser[0].dataValues))
    delete payload.password
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME })
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME })
    return res.status(200).json({ data: { refreshToken, accessToken, payload } })
  }
  else return res.status(400).json({ error: 'Wrong password' })
})


router.post('/reset-password-request', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })
  const existingUser = await authModel.findAll({ where: { email: email.toLowerCase() } })
  if (existingUser.length === 0) return res.status(400).json({ error: 'Email doesn\'t exists' })
  let code = resetPassCode(20)
  const updateUser = await authModel.update({ resetPassCode: code }, { where: { email: email } })
  const mg = mailgun.client({ username: 'api', key: process.env.API_KEY })
  mg.messages.create("sandbox6ec3153e507f4aa3b425650b00d96044.mailgun.org",
    {
      from: "iCare Support <fahmidsakib97@gmail.com>",
      to: [email],
      subject: "Reset password token",
      html: `<a href="http://localhost:3000/reset-password/${existingUser[0].dataValues.id}/${code}">Click here to reset your password</a>`,
    })
    .then(msg => res.status(200).json({ alert: "Kindly check your email" }))
    .catch(err => res.status(501).json({ error: err }))
})


router.get('/reset-password/:id/:code', async (req, res) => {
  try {
    const existingUser = await authModel.findOne({ where: { id: req.params.id } })
    if (existingUser.dataValues.resetPassCode !== req.params.code) return res.status(400).json({ error: 'Invalid link' })
    const updateUser = await authModel.update({ resetPassCode: '' }, { where: { id: req.params.id } })
    res.status(200).json({ data: existingUser.dataValues.email })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})

router.post('/reset-password-confirm', async (req, res) => {
  console.log(req.body)
  const { password, confirmPassword, email } = req.body
  if (!password || !confirmPassword || !email) return res.status(400).json({ error: 'Both fields are required' })
  if (password !== confirmPassword) return res.status(400).json({ error: 'Password does not match' })
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  try {
    const updateUser = await authModel.update({ password: hash, resetPassCode: '' }, { where: { email: email } })
    res.status(200).json({ alert: "Password changed successful" })
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
})


router.post('/token', async (req, res) => {
  const refreshToken = req.body.refreshToken
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    delete payload.exp
    delete payload.iat
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME })
    return res.status(200).json({ data: accessToken })
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token provided' })
  }
})


function resetPassCode(hashLength = 10) {
  const charPool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
  const chars = []
  for (let i = 0; i < hashLength; i++) {
    const randIndex = Math.floor(Math.random() * charPool.length)
    chars.push(charPool[randIndex])
  }
  return chars.join("")
}


module.exports = router