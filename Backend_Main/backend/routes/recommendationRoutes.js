const express = require('express')
const controller = require('../controllers/recommendationController')
const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')
const v = require('../middlewares/validate')

const router = express.Router()

router.get('/result/:result_id', authenticate, authorize('candidate', 'recruiter', 'admin'), v.id('result_id'), controller.byResult)

module.exports = router
