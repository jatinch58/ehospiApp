const express = require("express");
const router = express.Router();
const phoneLogin = require("./phoneLogin");
const hospital = require("./hospital");
router.use(phoneLogin);
router.use(hospital);
module.exports = router;
