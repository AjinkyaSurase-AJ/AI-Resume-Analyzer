const { error } = require('../utils/response')

const notFound = (req, res, next) => {
  next({ statusCode: 404, message: `Route not found: ${req.originalUrl}` })
}

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500
  if (process.env.NODE_ENV !== 'production') console.log(err)
  return error(res, err.message || 'Internal server error', status)
}

module.exports = { notFound, errorHandler }
