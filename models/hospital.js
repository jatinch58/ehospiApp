const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hospitalSchema = new Schema({
  hospitalName: {
    type: String,
    required: true,
  },
  hospitalCode: {
    type: String,
    required: true,
  },
  hospitalLocation: {
    type: String,
    required: true,
  },
  allbeds: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("Hospital", hospitalSchema);
