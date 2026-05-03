const express = require("express");
const app = express();
const port = 8888;

const medicationController = require("./controller/medication");
const usageRecordController = require("./controller/usageRecord");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("MedLog backend is running.");
});

app.use("/medication", medicationController);
app.use("/usageRecord", usageRecordController);

app.listen(port, () => {
  console.log(`MedLog app listening on port ${port}`);
});
