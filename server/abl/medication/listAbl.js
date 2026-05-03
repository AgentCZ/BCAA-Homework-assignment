const medicationDao = require("../../dao/medication-dao.js");

async function ListAbl(req, res) {
  try {
    const medicationList = medicationDao.list();

    // return properly filled dtoOut
    res.json({ itemList: medicationList });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
