const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1)
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100)
  return { page, limit, offset: (page - 1) * limit }
}

const paged = (records, total, page, limit) => ({
  records,
  pagination: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  },
})

module.exports = { getPagination, paged }
