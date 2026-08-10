const express = require('express')
const controller = require('../controllers/adminController')
const userController = require('../controllers/userController')
const authenticate = require('../middlewares/authenticate')
const authorize = require('../middlewares/authorize')
const v = require('../middlewares/validate')

const router = express.Router()

router.use(authenticate, authorize('admin'))
router.get('/dashboard', controller.dashboard)
router.get('/users', controller.users)
router.get('/resumes', controller.resumes)
router.get('/jds', controller.jds)
router.get('/results', controller.results)
router.get('/logs', controller.logs)
router.delete('/users/:id', v.id('id'), userController.remove)
router.delete('/resumes/:resumeId', controller.deleteResume)

module.exports = router
