const express = require("express");
const controller = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const v = require("../middlewares/validate");

const router = express.Router();

router.post("/signup", v.signup, controller.signup);
router.post("/signin", v.signin, controller.signin);
router.get("/profile", authenticate, controller.profile);
router.patch("/profile", authenticate, controller.updateProfile);
router.get("/", authenticate, authorize("admin"), controller.list);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  v.id("id"),
  controller.remove,
);
router.put("/change-password", authenticate, controller.changePassword);

module.exports = router;
