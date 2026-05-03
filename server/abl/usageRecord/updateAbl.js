const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const usageRecordDao = require("../../dao/usageRecord-dao.js");
const medicationDao = require("../../dao/medication-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    medicationId: { type: "string" },
    timestamp: { type: "string", format: "date-time" },
    notes: { type: "string", maxLength: 500 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
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

    // if medicationId is being changed, verify it exists
    if (usageRecord.medicationId) {
      const medication = medicationDao.get(usageRecord.medicationId);
      if (!medication) {
        res.status(400).json({
          code: "medicationDoesNotExist",
          message: `Medication with id ${usageRecord.medicationId} does not exist`,
        });
        return;
      }
    }

    // update usageRecord in persistent storage
    const updatedUsageRecord = usageRecordDao.update(usageRecord);
    if (!updatedUsageRecord) {
      res.status(404).json({
        code: "usageRecordNotFound",
        message: `UsageRecord with id ${usageRecord.id} not found`,
      });
      return;
    }

    // enrich with related medication
    const medication = medicationDao.get(updatedUsageRecord.medicationId);
    updatedUsageRecord.medication = medication;

    // return properly filled dtoOut
    res.json(updatedUsageRecord);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
