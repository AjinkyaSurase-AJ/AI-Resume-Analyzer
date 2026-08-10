const express = require('express')
const controller = require('../controllers/resultController')
const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')
const v = require('../middlewares/validate')

const router = express.Router()

router.get('/', authenticate, authorize('candidate', 'recruiter', 'admin'), controller.list)
router.get('/resume/:resume_id', authenticate, authorize('candidate', 'recruiter', 'admin'), v.id('resume_id'), controller.byResume)
router.get('/jd/:jd_id', authenticate, authorize('candidate', 'recruiter', 'admin'), v.id('jd_id'), controller.byJd)
router.get('/:id', authenticate, authorize('candidate', 'recruiter', 'admin'), v.id('id'), controller.getOne)

module.exports = router
