const Ajv = require("ajv");
const ajv = new Ajv();

const usageRecordDao = require("../../dao/usageRecord-dao.js");
const medicationDao = require("../../dao/medication-dao.js");

const schema = {
  type: "object",
  properties: {
    medicationId: { type: "string" },
  },
  required: [],
  additionalProperties: false,
};

async function ListAbl(req, res) {
  try {
    const filter = req.query?.medicationId ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, filter);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const usageRecordList = usageRecordDao.list(filter);

    // get medicationMap - allows frontend to display medication name next to each record
    const medicationMap = medicationDao.getMedicationMap();

    // return properly filled dtoOut
    res.json({ itemList: usageRecordList, medicationMap });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
