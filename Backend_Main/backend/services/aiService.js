const https = require('https')
const config = require('../config/config')

const generateSuggestions = async ({ resumeText, jdText, missingSkills }) => {
  if (config.aiProvider !== 'gemini' || !config.aiApiKey) return null

  const prompt = `Return 5 concise resume improvement recommendations as a JSON array of strings. Missing skills: ${missingSkills.join(', ')}. Resume: ${resumeText.slice(0, 1500)} JD: ${jdText.slice(0, 1500)}`
  const payload = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  const url = `/v1beta/models/gemini-1.5-flash:generateContent?key=${config.aiApiKey}`

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: url,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      timeout: 8000,
    }, (res) => {
      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => {
        try {
          const text = JSON.parse(body).candidates?.[0]?.content?.parts?.[0]?.text || ''
          const match = text.match(/\[[\s\S]*\]/)
          resolve(match ? JSON.parse(match[0]).slice(0, 8) : null)
        } catch (ex) {
          resolve(null)
        }
      })
    })
    req.on('error', () => resolve(null))
    req.on('timeout', () => {
      req.destroy()
      resolve(null)
    })
    req.write(payload)
    req.end()
  })
}

module.exports = { generateSuggestions }
