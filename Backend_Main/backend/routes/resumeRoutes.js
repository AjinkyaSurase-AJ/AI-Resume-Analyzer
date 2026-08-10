const express = require("express");
const controller = require("../controllers/resumeController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const upload = require("../middlewares/upload");
const v = require("../middlewares/validate");

const router = express.Router();

router.post(
  "/upload",
  authenticate,
  authorize("candidate", "recruiter", "admin"),
  upload.single("resume"),
  controller.upload,
);
router.get(
  "/",
  authenticate,
  authorize("candidate", "recruiter", "admin"),
  controller.list,
);
router.get(
  "/:id",
  authenticate,
  authorize("candidate", "recruiter", "admin"),
  v.id("id"),
  controller.getOne,
);
router.delete(
  "/:id",
  authenticate,
  authorize("candidate", "recruiter", "admin"),
  v.id("id"),
  controller.remove,
);

module.exports = router;
