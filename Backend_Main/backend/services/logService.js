const logModel = require('../models/logModel')

const write = async (req, event, description) => {
  await logModel.create({
    user_id: req.user?.user_id,
    event,
    description,
    ip_address: req.ip,
  })
}

module.exports = { write }
