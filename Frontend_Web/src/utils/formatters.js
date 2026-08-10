export const cx = (...classes) => classes.filter(Boolean).join(' ')

export const titleCase = (value = '') => String(value)
  .replaceAll('_', ' ')
  .replace(/\b\w/g, (character) => character.toUpperCase())

export const initials = (name = 'User') => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase()

export const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
}

export const truncate = (value = '', length = 90) => String(value).length > length
  ? `${String(value).slice(0, length)}…`
  : String(value)

export const pageRecords = (data) => Array.isArray(data)
  ? data
  : (data?.records || data?.candidates || [])
