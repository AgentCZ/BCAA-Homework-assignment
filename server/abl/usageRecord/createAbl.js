const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const usageRecordDao = require("../../dao/usageRecord-dao.js");
const medicationDao = require("../../dao/medication-dao.js");

const schema = {
  type: "object",
  properties: {
    medicationId: { type: "string" },
    // timestamp is OPTIONAL - if not provided, current time is used.
    // This allows retroactive logging of past doses.
    timestamp: { type: "string", format: "date-time" },
    notes: { type: "string", maxLength: 500 },
  },
  required: ["medicationId"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let usageRecord = req.body;

    // validate input
    const valid = ajv.validate(schema, usageRecord);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check that medicationId exists
    const medication = medicationDao.get(usageRecord.medicationId);
    if (!medication) {
      res.status(400).json({
        code: "medicationDoesNotExist",
        message: `Medication with id ${usageRecord.medicationId} does not exist`,
      });
      return;
    }

    // validate timestamp - must not be in the future
    if (usageRecord.timestamp) {
      if (new Date(usageRecord.timestamp) > new Date()) {
        res.status(400).json({
          code: "invalidTimestamp",
          message: "timestamp must not be in the future",
        });
        return;
      }
    }

    // store usageRecord to persistent storage
    // DAO fills current time if timestamp is missing
    usageRecord = usageRecordDao.create(usageRecord);
    usageRecord.medication = medication;

    // return properly filled dtoOut
    res.json(usageRecord);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
