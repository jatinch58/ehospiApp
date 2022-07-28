const express = require("express");
const auth = require("../middlewares/verifyToken");
const router = express.Router();
const hospital = require("../controllers/hospital");
const { formUpload, formUpload1 } = require("../middlewares/fileUpload");
router.get("/user/findHospital", auth.verifyToken, hospital.findHospital);
router.post(
  "/user/insurance/bookBed",
  auth.verifyToken,
  formUpload,
  hospital.hospitalForm
);
router.post(
  "/user/self/bookBed",
  auth.verifyToken,
  formUpload1,
  hospital.hospitalForm1
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
