const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hospitalForm = new Schema({
  bookingId: {
    type: String,
  },
  bookingStatus: {
    type: String,
  },
  bookedBy: {
    type: String,
  },
  hospitalCode: {
    type: String,
  },
  bedType: {
    type: String,
  },
  bedPrice: {
    type: Number,
  },
  bookingDate: {
    type: String,
  },
  bookingTime: {
    type: String,
  },
  paymentStatus: {
    type: String,
  },
  patientName: {
    type: String,
  },
  familyMember: {
    type: String,
  },
  dob: {
    type: String,
  },
  gender: {
    type: String,
  },
  fatherHusbandName: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  nationality: {
    type: String,
  },
  religion: {
    type: String,
  },
  monthlyIncome: {
    type: Number,
  },
  occupation: {
    type: String,
  },
  altPhone: {
    type: String,
  },
  doctorName: {
    type: String,
  },
  policyNumber: {
    type: String,
  },
  employerName: {
    type: String,
  },
  employerId: {
    type: String,
  },
  prescriptionUrl: {
    type: String,
  },
  idProofUrl: {
    type: String,
  },
  insuranceUrl: {
    type: String,
  },
});

module.exports = mongoose.model("hospitalform", hospitalForm);
