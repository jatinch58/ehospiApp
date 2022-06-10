const express = require("express");
const auth = require("../middlewares/verifyToken");
const router = express.Router();
const hospital = require("../controllers/hospital");

router.get("/user/findHospital", auth.verifyToken, hospital.findHospital);
router.post("/user/bookBed", auth.verifyToken, hospital.hospitalForm);
router.get("/user/findBookings", auth.verifyToken, hospital.findBookings);
router.get("/user/findInsurance", auth.verifyToken, hospital.findInsurance);
router.get(
  "/user/insuranceHospital/:insuranceName",
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
module.exports = router;
