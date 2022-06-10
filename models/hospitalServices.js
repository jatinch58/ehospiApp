const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hospitalServicesSchema = new Schema({
  hospitalCode: {
    type: String,
    required: true,
  },
  details: [
    {
      services: {
        type: String,
        required: true,
      },
    },
  ],
});
module.exports = mongoose.model("hospitalServices", hospitalServicesSchema);
