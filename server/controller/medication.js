const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/medication/getAbl");
const ListAbl = require("../abl/medication/listAbl");
const CreateAbl = require("../abl/medication/createAbl");
const UpdateAbl = require("../abl/medication/updateAbl");
const DeleteAbl = require("../abl/medication/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
