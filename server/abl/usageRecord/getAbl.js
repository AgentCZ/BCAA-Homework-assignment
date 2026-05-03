const Ajv = require("ajv");
const ajv = new Ajv();

const usageRecordDao = require("../../dao/usageRecord-dao.js");
const medicationDao = require("../../dao/medication-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.query?.id ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read usageRecord by given id
    const usageRecord = usageRecordDao.get(reqParams.id);
    if (!usageRecord) {
      res.status(404).json({
        code: "usageRecordNotFound",
        message: `UsageRecord with id ${reqParams.id} not found`,
      });
      return;
    }

    // enrich with related medication
    const medication = medicationDao.get(usageRecord.medicationId);
    usageRecord.medication = medication;

    // return properly filled dtoOut
    res.json(usageRecord);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
