const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const config = require('./config/config')
const userRoutes = require('./routes/userRoutes')
const resumeRoutes = require('./routes/resumeRoutes')
const jdRoutes = require('./routes/jobDescriptionRoutes')
const analysisRoutes = require('./routes/analysisRoutes')
const rankingRoutes = require('./routes/rankingRoutes')
const recruiterRoutes = require('./routes/recruiterRoutes')
const skillRoutes = require('./routes/skillRoutes')
const resultRoutes = require('./routes/resultRoutes')
const recommendationRoutes = require('./routes/recommendationRoutes')
const adminRoutes = require('./routes/adminRoutes')
const { notFound, errorHandler } = require('./middlewares/errorHandler')

const app = express()

app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.resolve(config.uploadDir)))

app.get('/health', (req, res) => res.json({ success: true, message: 'AI Resume Analyzer backend is running' }))

app.use('/api/users', userRoutes)
app.use('/api/resumes', resumeRoutes)
app.use('/api/jds', jdRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/rankings', rankingRoutes)
app.use('/recruiter', recruiterRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/results', resultRoutes)
app.use('/api/recommendations', recommendationRoutes)
app.use('/api/admin', adminRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
