const express = require("express");
const { healthCheck } = require("../controllers/healthController");
const { healthStatus } = require("../controllers/healthStatus");

const router = express.Router();

router.get("/", healthCheck);
router.get("/status", healthStatus);

module.exports = router;
