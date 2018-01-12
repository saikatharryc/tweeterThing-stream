const router = require("express").Router();
const authMiddleware = require("../../middlewares/auth");
const auth = require("./auth");
const user = require("./user");

router.use("/auth", auth);
router.use("/v1", authMiddleware);
router.use("/v1/user", user);

module.exports = router;
