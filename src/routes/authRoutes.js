const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");
const { refreshAccessToken } = require("../controllers/refreshtokenController");

router.post("/auth/login", login);
router.post("/auth/register", register);
router.post("/auth/refresh", refreshAccessToken);

module.exports = router;
