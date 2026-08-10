const recommendationModel = require('../models/recommendationModel')
const asyncHandler = require('../utils/asyncHandler')
const { success } = require('../utils/response')

exports.byResult = asyncHandler(async (req, res) => {
  success(res, 'Recommendations fetched successfully', await recommendationModel.byResult(req.params.result_id))
})
