const multer = require("multer");
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});
const upload = multer({ storage });
exports.upload = multer({ storage }).single("image");
exports.formUpload = upload.fields([
  { name: "prescription", maxCount: 1 },
  { name: "idProof", maxCount: 1 },
  { name: "insurance", maxCount: 1 },
]);
