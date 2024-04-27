const { readDb, writeDb } = require("../utils/dbFunctions");
const dbName = "db.json";

function loadDb() {
  try {
    readDb(dbName);
  } catch (error) {
    writeDb({}, dbName);
    const data = {
      bots: [],
    };
    writeDb(data);
  }
}

module.exports = { loadDb };
