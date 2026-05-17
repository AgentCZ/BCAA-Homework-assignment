const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const usageRecordFolderPath = path.join(
  __dirname,
  "storage",
  "usageRecordList"
);

// Method to read a usageRecord from a file
function get(usageRecordId) {
  try {
    const filePath = path.join(usageRecordFolderPath, `${usageRecordId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadUsageRecord", message: error.message };
  }
}

// Method to write a usageRecord to a file
function create(usageRecord) {
  try {
    usageRecord.id = crypto.randomBytes(16).toString("hex");
    // if timestamp is not provided, use current time
    if (!usageRecord.timestamp) {
      usageRecord.timestamp = new Date().toISOString();
    }
    const filePath = path.join(
      usageRecordFolderPath,
      `${usageRecord.id}.json`
    );
    const fileData = JSON.stringify(usageRecord);
    fs.writeFileSync(filePath, fileData, "utf8");
    return usageRecord;
  } catch (error) {
    throw { code: "failedToCreateUsageRecord", message: error.message };
  }
}

// Method to update usageRecord in a file
function update(usageRecord) {
  try {
    const currentUsageRecord = get(usageRecord.id);
    if (!currentUsageRecord) return null;
    const newUsageRecord = { ...currentUsageRecord, ...usageRecord };
    const filePath = path.join(
      usageRecordFolderPath,
      `${usageRecord.id}.json`
    );
    const fileData = JSON.stringify(newUsageRecord);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newUsageRecord;
  } catch (error) {
    throw { code: "failedToUpdateUsageRecord", message: error.message };
  }
}

// Method to remove a usageRecord from a file
function remove(usageRecordId) {
  try {
    const filePath = path.join(usageRecordFolderPath, `${usageRecordId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveUsageRecord", message: error.message };
  }
}

// Method to list usageRecords, optionally filtered by medicationId
// and sorted from newest to oldest
function list(filter = {}) {
  try {
    const files = fs.readdirSync(usageRecordFolderPath);
    let usageRecordList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(usageRecordFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });

    if (filter.medicationId) {
      usageRecordList = usageRecordList.filter(
        (item) => item.medicationId === filter.medicationId
      );
    }

    // sort from newest to oldest
    usageRecordList.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    return usageRecordList;
  } catch (error) {
    throw { code: "failedToListUsageRecords", message: error.message };
  }
}

// Method to list usageRecords by medicationId (used by cascade delete)
function listByMedicationId(medicationId) {
  const usageRecordList = list();
  return usageRecordList.filter((item) => item.medicationId === medicationId);
}

// Cascade delete - removes all usageRecords belonging to given medication
function removeByMedicationId(medicationId) {
  const related = listByMedicationId(medicationId);
  related.forEach((item) => remove(item.id));
  return { removedCount: related.length };
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  listByMedicationId,
  removeByMedicationId,
};
