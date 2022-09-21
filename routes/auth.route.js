const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
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
  console.log(existingUser)
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


module.exports = router