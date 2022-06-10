const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hospitalDepartmentSchema = new Schema({
  hospitalCode: {
    type: String,
    required: true,
  },
  details: [
    {
      department: {
        type: String,
        required: true,
      },
    },
  ],
});
module.exports = mongoose.model("hospitalDepartment", hospitalDepartmentSchema);
