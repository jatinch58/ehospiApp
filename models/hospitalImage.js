const { model, Schema } = require("mongoose");
const imageSchema = new Schema({
  hospitalCode: {
    type: String,
    required: true,
  },
  imageUrl: [
    {
      type: String,
    },
  ],
});
module.exports = model("HospitalImage", imageSchema);
