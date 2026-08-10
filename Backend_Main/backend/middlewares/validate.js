const { body, param, validationResult } = require('express-validator')
const { error } = require('../utils/response')

const validate = (rules) => [
  rules,
  (req, res, next) => {
    const result = validationResult(req)
    if (!result.isEmpty()) return error(res, result.array()[0].msg, 400)
    next()
  },
]

const idParam = (name = 'id') => param(name).isInt({ min: 1 }).withMessage(`${name} must be a valid integer`)

module.exports = {
  validate,
  idParam,
  signup: validate([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters'),
    body('role').optional().isIn(['candidate', 'recruiter']).withMessage('Admin role cannot be assigned during signup. Please register as candidate or recruiter.'),
  ]),
  signin: validate([
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  jd: validate([
    body('title').trim().notEmpty().withMessage('JD title is required'),
    body('description').trim().notEmpty().withMessage('JD description is required'),
  ]),
  skill: validate([body('skill_name').trim().notEmpty().withMessage('Skill name is required')]),
  id: (name = 'id') => validate([idParam(name)]),
}
