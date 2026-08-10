const express = require('express')
const controller = require('../controllers/jobDescriptionController')
const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')
const v = require('../middlewares/validate')

const router = express.Router()

router.post('/', authenticate, authorize('recruiter', 'admin'), v.jd, controller.create)
router.get('/', authenticate, authorize('candidate', 'recruiter', 'admin'), controller.list)
router.get('/:id', authenticate, authorize('candidate', 'recruiter', 'admin'), v.id('id'), controller.getOne)
router.delete('/:id', authenticate, authorize('recruiter', 'admin'), v.id('id'), controller.remove)

module.exports = router
