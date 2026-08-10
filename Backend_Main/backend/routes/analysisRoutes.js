const express = require("express");
const controller = require("../controllers/analysisController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/candidate",
  authenticate,
  authorize("candidate", "admin"),
  upload.single("resume"),
  controller.candidateAnalysis,
);

router.get(
  "/result/:resumeId",
  authenticate,
  authorize("candidate", "recruiter", "admin"),
  controller.getAnalysisResult,
);

module.exports = router;
