const { model, Schema } = require("mongoose");

const refreshTokenSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

module.exports = model("refreshToken", refreshTokenSchema);
