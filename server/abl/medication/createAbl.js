const Ajv = require("ajv");
const ajv = new Ajv();

const medicationDao = require("../../dao/medication-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 100 },
    dosage: { type: "string", maxLength: 100 },
    instructions: { type: "string", maxLength: 500 },
  },
  required: ["name"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let medication = req.body;

    // validate input
    const valid = ajv.validate(schema, medication);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // store medication to a persistent storage
    try {
      medication = medicationDao.create(medication);
    } catch (e) {
      res.status(400).json({
        ...e,
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

module.exports = CreateAbl;
