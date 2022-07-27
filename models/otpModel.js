const { model, Schema } = require("mongoose");
const otpSchema = new Schema({
  msgid: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  createdAt: { type: Date, expires: "2m", default: Date.now },
});
module.exports = model("otp", otpSchema);
