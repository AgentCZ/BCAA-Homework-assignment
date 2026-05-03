const Ajv = require("ajv");
const ajv = new Ajv();
const medicationDao = require("../../dao/medication-dao.js");
const usageRecordDao = require("../../dao/usageRecord-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
    const reqParams = req.body;

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

    // cascade delete - remove all usageRecords related to this medication
    const cascadeResult = usageRecordDao.removeByMedicationId(reqParams.id);

    // remove medication from persistent storage
    medicationDao.remove(reqParams.id);

    // return properly filled dtoOut
    res.json({
      removedUsageRecordsCount: cascadeResult.removedCount,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteAbl;
