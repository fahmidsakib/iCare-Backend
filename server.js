require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const authRouter = require('./routes/auth.route')
const doctorRouter = require('./routes/doctor.route')
const patientRouter = require('./routes/patient.route')


const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("dev"))
app.use(express.static("public"))
app.use(express.json())


app.use('/auth', authRouter)
app.use(authenticateRequest)
app.use('/doctor', doctorRouter)
app.use('/patient', patientRouter)



app.listen(process.env.PORT || 8000)


function authenticateRequest(req, res, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.status(401).json({ error: 'No token provided' })
  const accessToken = authHeader.split(' ')[1]
  if (!accessToken) return res.status(401).json({ error: 'Improper access token provided' })
  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    req.payload = payload
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid access token provided' })
  }
}