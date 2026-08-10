const resultModel = require('../models/resultModel')
const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/apiError')
const { success } = require('../utils/response')
const { getPagination, paged } = require('../utils/pagination')

exports.list = asyncHandler(async (req, res) => {
  const paging = getPagination(req.query)
  const result = await resultModel.list({ ...paging, user: req.user })
  success(res, 'Records fetched successfully', paged(result.records, result.total, paging.page, paging.limit))
})

exports.getOne = asyncHandler(async (req, res) => {
  const result = await resultModel.findById(req.params.id)
  if (!result) throw new ApiError(404, 'Result not found')
  success(res, 'Result fetched successfully', result)
})

exports.byResume = asyncHandler(async (req, res) => {
  const paging = getPagination(req.query)
  const result = await resultModel.list({ ...paging, user: req.user, resume_id: req.params.resume_id })
  success(res, 'Records fetched successfully', paged(result.records, result.total, paging.page, paging.limit))
})

exports.byJd = asyncHandler(async (req, res) => {
  const paging = getPagination(req.query)
  const result = await resultModel.list({ ...paging, user: req.user, jd_id: req.params.jd_id })
  success(res, 'Records fetched successfully', paged(result.records, result.total, paging.page, paging.limit))
})
