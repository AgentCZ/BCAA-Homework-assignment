const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/usageRecord/getAbl");
const ListAbl = require("../abl/usageRecord/listAbl");
const CreateAbl = require("../abl/usageRecord/createAbl");
const UpdateAbl = require("../abl/usageRecord/updateAbl");
const DeleteAbl = require("../abl/usageRecord/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
