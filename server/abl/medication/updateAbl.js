const Ajv = require("ajv");
const ajv = new Ajv();

const medicationDao = require("../../dao/medication-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string", minLength: 1, maxLength: 100 },
    dosage: { type: "string", maxLength: 100 },
    instructions: { type: "string", maxLength: 500 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
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

    // update medication in persistent storage
    let updatedMedication;
    try {
      updatedMedication = medicationDao.update(medication);
    } catch (e) {
      res.status(400).json({
        ...e,
      });
      return;
    }
    if (!updatedMedication) {
      res.status(404).json({
        code: "medicationNotFound",
        message: `Medication with id ${medication.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(updatedMedication);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
