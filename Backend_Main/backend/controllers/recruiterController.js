const analysisService = require('../services/analysisService')
const resultModel = require('../models/resultModel')
const logService = require('../services/logService')
const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/apiError')
const { success } = require('../utils/response')

const asArray = (value) => Array.isArray(value) ? value : []

exports.analyze = asyncHandler(async (req, res) => {
  const resumes = asArray(req.files)
  if (!resumes.length) throw new ApiError(400, 'Upload at least one resume PDF using the resumes field')
  if (resumes.length > 5) throw new ApiError(400, 'A maximum of 5 resume PDFs can be analyzed at once')

  const jdText = String(req.body.jd_text || req.body.job_description || '').trim()
  if (!jdText) throw new ApiError(400, 'Job description is required')

  if (resumes.some((file) => file.mimetype !== 'application/pdf')) {
    throw new ApiError(400, 'Only PDF resumes are accepted for recruiter analysis')
  }

  const outputs = []
  let jdId = null
  for (const file of resumes) {
    const output = await analysisService.runAnalysis({
      file,
      user: req.user,
      candidate_id: null,
      jd_id: jdId,
      jd_title: req.body.jd_title || 'Recruiter Job Description',
      jd_text: jdText,
      experience_required: req.body.experience_required || ''
    })
    jdId = output.jd_id
    outputs.push(output)
  }

  const ranked = await resultModel.rankedByJd({ jdId, user: req.user })
  const rankByResultId = new Map()
  for (let index = 0; index < ranked.length; index += 1) {
    const rank = index + 1
    await resultModel.setRanking(ranked[index].result_id, rank)
    rankByResultId.set(ranked[index].result_id, rank)
  }

  const candidates = outputs
    .map((output) => ({
      rank: rankByResultId.get(output.result_id),
      ...output
    }))
    .sort((a, b) => a.rank - b.rank)

  // Use the persisted name from the ranked query; this remains accurate after storage renames files.
  const nameByResultId = new Map(ranked.map((row) => [row.result_id, row.original_name]))
  candidates.forEach((candidate) => { candidate.file_name = nameByResultId.get(candidate.result_id) || null })

  await logService.write(req, 'recruiter_batch_analysis', `Analyzed and ranked ${resumes.length} resumes for JD ${jdId}`)
  success(res, 'Recruiter analysis completed successfully', { jd_id: jdId, total_resumes: resumes.length, candidates }, 201)
})
