const logger = require("../utils/logger");
const fs = require("fs");

function readDb(dbName = "db.json") {
  const data = fs.readFileSync(dbName, "utf8");
  return JSON.parse(data);
}

function writeDb(obj, dbName = "db.json") {
  if (!obj)
    return logger.error("Failed to write to database: No object provided");
  try {
    fs.writeFileSync(dbName, JSON.stringify(obj, null, 2));
  } catch (err) {
    logger.error(`Error writing to database: ${err.message}`);
  }
}

module.exports = { readDb, writeDb };
