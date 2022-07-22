const express = require("express");
const router = express.Router();
const auth = require("../middlewares/verifyToken");
const { upload } = require("../middlewares/fileUpload");
const phoneLogin = require("../controllers/phoneLogin");
router.get("/user/profile", auth.verifyToken, phoneLogin.showProfile);
router.post("/user/phone/login", phoneLogin.phoneLogin);
router.post("/user/phone/verifyOTP", phoneLogin.verifyOTP);
router.post(
  "/user/phone/createProfile",
  auth.verifyToken,
  phoneLogin.createProfile
);
router.post("/user/refreshToken", phoneLogin.refreshToken);
router.get(
  "/user/alreadyRegistered",
  auth.verifyToken,
  phoneLogin.isAlreadyRegistered
);
router.put("/user/updateProfile", auth.verifyToken, phoneLogin.updateProfile);
router.post("/user/facebook", phoneLogin.checkFacebookToken);
router.post(
  "/user/uploadPicture",
  auth.verifyToken,
  upload,
  phoneLogin.uploadProfilePicture
);
router.get(
  "/user/profilePicture",
  auth.verifyToken,
  phoneLogin.getProfilePicture
);
router.put(
  "/user/profilePicture",
  auth.verifyToken,
  upload,
  phoneLogin.updateProfilePicture
);
module.exports = router;
