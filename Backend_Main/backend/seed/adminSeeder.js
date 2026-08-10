require('dotenv').config()

const bcrypt = require('bcrypt')
const db = require('../config/db')
const userModel = require('../models/userModel')

const seed = async () => {
  const email = 'admin@gmail.com'
  const existing = await userModel.findByEmail(email)
  if (existing) {
    console.log('Admin already exists. Skipping.')
    await db.end()
    return
  }

  const password = await bcrypt.hash('admin123', 10)
  await userModel.create({ name: 'Admin', email, password, role: 'admin' })
  console.log('Admin created successfully.')
  await db.end()
}

seed().catch(async (ex) => {
  console.log(ex)
  await db.end()
  process.exit(1)
})
