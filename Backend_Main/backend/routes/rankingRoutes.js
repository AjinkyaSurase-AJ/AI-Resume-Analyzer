const express = require('express')
const controller = require('../controllers/rankingController')
const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')
const upload = require('../middlewares/upload')
const v = require('../middlewares/validate')

const router = express.Router()

router.post('/:jd_id', authenticate, authorize('recruiter', 'admin'), v.id('jd_id'), upload.array('resumes', 20), controller.run)
router.get('/:jd_id', authenticate, authorize('recruiter', 'admin'), v.id('jd_id'), controller.get)

module.exports = router
