const Joi = require("joi");
const hospital = require("../models/hospital");
const hospitalForm = require("../models/hospitalForm");
const insurancedb = require("../models/insurance");
const hospitalInsurancedb = require("../models/hospitalInsurance");
const departmentsdb = require("../models/hospitalDepartments");
const servicesdb = require("../models/hospitalServices");
const bedTypedb = require("../models/bedType");
const imagedb = require("../models/hospitalImage");

exports.findHospital = async (req, res) => {
  try {
    const HospitalFind = await hospital.find({}, { _id: 0, __v: 0 });
    res.status(200).send(HospitalFind);
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
/////////////////////////////////Hospital Form///////////////////////////////
exports.hospitalForm = async (req, res) => {
  try {
    const { body } = req;
    const hospitalFormSchema = Joi.object().keys({
      hospitalCode: Joi.string().required(),
      bedType: Joi.string().required(),
      bedPrice: Joi.number().required(),
      bookingDate: Joi.date().greater("now").required(),
      bookingTime: Joi.string().required(),
      paymentStatus: Joi.string().valid("pending", "paid").required(),
      patientName: Joi.string().required(),
      familyMember: Joi.string().required(),
      dob: Joi.date().less("now").greater("01-01-1920").required(),
      gender: Joi.string().valid("Male", "Female", "Other").required(),
      fatherHusbandName: Joi.string().required(),
      address: Joi.string().required(),
      phone: Joi.string()
        .regex(/^[6-9]{1}[0-9]{9}$/)
        .required(),
      email: Joi.string().email().required(),
      nationality: Joi.string().required(),
      religion: Joi.string().required(),
      monthlyIncome: Joi.number().required(),
      occupation: Joi.string().required(),
      altPhone: Joi.string()
        .regex(/^[6-9]{1}[0-9]{9}$/)
        .required(),
      doctorName: Joi.string().required(),
      policyNumber: Joi.string(),
      employerName: Joi.string(),
      employerId: Joi.string(),
    });
    let result = hospitalFormSchema.validate(body);
    if (result.error) {
      res.status(403).send("Please enter valid details");
    } else {
      const n = Math.floor(Math.random() * 90000000) + 10000000;
      const addHospitalForm = new hospitalForm({
        bookingId: n,
        bookingStatus: "pending",
        hospitalCode: req.body.hospitalCode,
        bookedBy: req.user.uid,
        bedType: req.body.bedType,
        bedPrice: req.body.bedPrice,
        bookingDate: req.body.bookingDate,
        bookingTime: req.body.bookingTime,
        paymentStatus: req.body.paymentStatus,
        patientName: req.body.patientName,
        familyMember: req.body.familyMember,
        dob: req.body.dob,
        gender: req.body.gender,
        fatherHusbandName: req.body.fatherHusbandName,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        nationality: req.body.nationality,
        religion: req.body.religion,
        monthlyIncome: req.body.monthlyIncome,
        occupation: req.body.occupation,
        altPhone: req.body.altPhone,
        doctorName: req.body.doctorName,
        policyNumber: req.body.policyNumber,
        employerName: req.body.employerName,
        employerId: req.body.employerId,
      });

      await addHospitalForm.save();
      res.status(200).send({ message: "Registered sucessfull" });
    }
  } catch (e) {
    res.send({ message: e.name });
  }
};
exports.findBookings = async (req, res) => {
  try {
    const bookingFind = await hospitalForm.find(
      { bookedBy: req.user.uid },
      { _id: 0, __v: 0 }
    );
    res.status(200).send(bookingFind);
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
exports.findInsurance = async (req, res) => {
  try {
    const insuranceFind = await insurancedb.find({}, { _id: 0, __v: 0 });
    res.status(200).send(insuranceFind);
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};

exports.insuranceHospital = async (req, res) => {
  try {
    hospitalInsurancedb
      .aggregate([
        {
          $match: {
            "details.insurance": req.params.insuranceName,
            "details.tpa": req.params.tpa,
          },
        },
        {
          $lookup: {
            from: "hospitals",
            localField: "hospitalCode",
            foreignField: "hospitalCode",
            as: "data",
          },
        },
        {
          $unset: ["details", "__v", "_id"],
        },
      ])
      .exec()
      .then((a) => {
        res.send(a);
      });
  } catch (err) {
    res.status(500).send(err);
  }
};
/////////////////////////////////hospitaldepartments///////////////////
exports.findDepartments = async (req, res) => {
  try {
    const departmentFind = await departmentsdb.find({
      hospitalCode: req.params.hospitalCode,
    });
    res.status(200).send(departmentFind);
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};

exports.findServices = async (req, res) => {
  try {
    const servicesFind = await servicesdb.find({
      hospitalCode: req.params.hospitalCode,
    });
    res.status(200).send(servicesFind);
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
exports.findBedTypes = async (req, res) => {
  try {
    const bedFind = await bedTypedb.find({
      hospitalCode: req.params.hospitalCode,
    });
    res.status(200).send(bedFind);
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
exports.getHospitalPicture = async (req, res) => {
  try {
    const result = await imagedb.findOne({
      hospitalCode: req.params.hospitalCode,
    });
    res.send({ data: result.imageUrl });
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
exports.getBedImages = async (req, res) => {
  try {
    const result = await bedTypedb.findOne(
      {
        hospitalCode: req.params.hospitalCode,
        beds: { $elemMatch: { _id: req.params.id } },
      },
      { "beds.$": 1 }
    );
    res.send({ images: result.beds[0].bedImages });
  } catch (err) {
    res.status(500).send({ message: err.name });
  }
};
