require('dotenv').config()

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ Warning: JWT_SECRET environment variable is not defined. Using default development secret.");
}

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  uploadDir: process.env.UPLOAD_DIR || 'uploads/resumes',
}
