const fs = require("fs");
const path = require("path");
const multer = require("multer");
const config = require("../config/config");

const uploadDir = path.resolve(config.uploadDir);
fs.mkdirSync(uploadDir, { recursive: true });

const allowed = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const allowedExtensions = [".pdf", ".doc", ".docx"];

    if (!allowedExtensions.includes(extension)) {
      return cb(new Error("Only PDF, DOC and DOCX resume files are allowed"));
    }

    cb(null, true);
  },
});
