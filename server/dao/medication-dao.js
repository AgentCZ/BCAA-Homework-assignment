const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const medicationFolderPath = path.join(__dirname, "storage", "medicationList");

// Method to read a medication from a file
function get(medicationId) {
  try {
    const filePath = path.join(medicationFolderPath, `${medicationId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadMedication", message: error.message };
  }
}

// Method to write a medication to a file
function create(medication) {
  try {
    const medicationList = list();
    if (medicationList.some((item) => item.name === medication.name)) {
      throw {
        code: "uniqueNameAlreadyExists",
        message: "medication with given name already exists",
      };
    }
    medication.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(medicationFolderPath, `${medication.id}.json`);
    const fileData = JSON.stringify(medication);
    fs.writeFileSync(filePath, fileData, "utf8");
    return medication;
  } catch (error) {
    if (error.code === "uniqueNameAlreadyExists") throw error;
    throw { code: "failedToCreateMedication", message: error.message };
  }
}

// Method to update medication in a file
function update(medication) {
  try {
    const currentMedication = get(medication.id);
    if (!currentMedication) return null;

    if (medication.name && medication.name !== currentMedication.name) {
      const medicationList = list();
      if (medicationList.some((item) => item.name === medication.name)) {
        throw {
          code: "uniqueNameAlreadyExists",
          message: "medication with given name already exists",
        };
      }
    }

    const newMedication = { ...currentMedication, ...medication };
    const filePath = path.join(medicationFolderPath, `${medication.id}.json`);
    const fileData = JSON.stringify(newMedication);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newMedication;
  } catch (error) {
    if (error.code === "uniqueNameAlreadyExists") throw error;
    throw { code: "failedToUpdateMedication", message: error.message };
  }
}

// Method to remove a medication from a file
function remove(medicationId) {
  try {
    const filePath = path.join(medicationFolderPath, `${medicationId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveMedication", message: error.message };
  }
}

// Method to list medications in a folder
function list() {
  try {
    const files = fs.readdirSync(medicationFolderPath);
    const medicationList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(medicationFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    return medicationList;
  } catch (error) {
    throw { code: "failedToListMedications", message: error.message };
  }
}

// get medicationMap (used by usageRecord listAbl to enrich items with medication data)
function getMedicationMap() {
  const medicationMap = {};
  const medicationList = list();
  medicationList.forEach((medication) => {
    medicationMap[medication.id] = medication;
  });
  return medicationMap;
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  getMedicationMap,
};
