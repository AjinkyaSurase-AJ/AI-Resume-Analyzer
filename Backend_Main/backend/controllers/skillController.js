const skillModel = require('../models/skillModel')
const asyncHandler = require('../utils/asyncHandler')
const { success } = require('../utils/response')
const { getPagination, paged } = require('../utils/pagination')

exports.create = asyncHandler(async (req, res) => {
  success(res, 'Skill saved successfully', await skillModel.create(req.body.skill_name), 201)
})

exports.list = asyncHandler(async (req, res) => {
  const paging = getPagination(req.query)
  const result = await skillModel.list(paging)
  success(res, 'Records fetched successfully', paged(result.records, result.total, paging.page, paging.limit))
})

exports.byResume = asyncHandler(async (req, res) => {
  success(res, 'Skills fetched successfully', await skillModel.byResume(req.params.resume_id))
})

exports.byJd = asyncHandler(async (req, res) => {
  success(res, 'Skills fetched successfully', await skillModel.byJd(req.params.jd_id))
})
