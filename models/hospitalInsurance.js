const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hospitalInsuranceSchema = new Schema({
  hospitalCode: {
    type: String,
    required: true,
  },
  details: [
    {
      insurance: {
        type: String,
        required: true,
      },
    },
  ],
});
module.exports = mongoose.model("hospitalInsurance", hospitalInsuranceSchema);
