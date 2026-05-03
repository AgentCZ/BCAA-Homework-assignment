const Ajv = require("ajv");
const ajv = new Ajv();
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

    // read medication by given id
    const medication = medicationDao.get(reqParams.id);
    if (!medication) {
      res.status(404).json({
        code: "medicationNotFound",
        message: `Medication with id ${reqParams.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(medication);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;
