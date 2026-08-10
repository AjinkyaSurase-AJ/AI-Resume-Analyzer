const express = require('express')
const controller = require('../controllers/recruiterController')
const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')
const upload = require('../middlewares/upload')

const router = express.Router()

// multipart/form-data: jd_text, jd_title?, experience_required?, resumes (1-5 PDFs)
router.post('/analyze', authenticate, authorize('recruiter', 'admin'), upload.array('resumes', 5), controller.analyze)

module.exports = router
