const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const insuranceSchema = new Schema({
  insurance: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("adminInsurance", insuranceSchema);
