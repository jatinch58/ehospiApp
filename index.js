const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const allRoutes = require("./routes/routes");
const app = express();
app.use(cors());
app.use(express.json());
app.use(allRoutes);
let port = process.env.PORT || 8000;
async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://kickr:bzMgnSGQaNhxWlrh@cluster0.hizynpg.mongodb.net/ehospi?retryWrites=true&w=majority"
    );
    console.log("Database connected sucessfully");
  } catch (error) {
    console.log(error);
  }
}
main();

app.listen(port, () => console.log(`Server listening on port ${port}`));
