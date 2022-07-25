const express = require("express");
const auth = require("../middlewares/verifyToken");
const router = express.Router();
const hospital = require("../controllers/hospital");
const { formUpload } = require("../middlewares/fileUpload");
router.get("/user/findHospital", auth.verifyToken, hospital.findHospital);
router.post(
  "/user/bookBed",
  auth.verifyToken,
  formUpload,
  hospital.hospitalForm
);
router.get("/user/findBookings", auth.verifyToken, hospital.findBookings);
router.get("/user/findInsurance", auth.verifyToken, hospital.findInsurance);
router.get(
  "/user/insuranceHospital/:insuranceName/:tpa",
  hospital.insuranceHospital
);
router.get(
  "/user/findDepartment/:hospitalCode",
  auth.verifyToken,
  hospital.findDepartments
);
router.get(
  "/user/findServices/:hospitalCode",
  auth.verifyToken,
  hospital.findServices
);
router.get(
  "/user/findBeds/:hospitalCode",
  auth.verifyToken,
  hospital.findBedTypes
);
router.get(
  "/user/getHospitalImage/:hospitalCode",
  auth.verifyToken,
  hospital.getHospitalPicture
);
router.get(
  "/user/getBedImages/:hospitalCode/:id",
  auth.verifyToken,
  hospital.getBedImages
);
module.exports = router;
