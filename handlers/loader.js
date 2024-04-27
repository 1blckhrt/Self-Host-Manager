const { loadDb } = require("./dbHandler");
const { commandHandler } = require("./cmdHandler");
const { createFolders } = require("./fileHandler");
const logger = require("../utils/logger");

function loader() {
  logger.debug(
    "Make sure you put your bots in the 'bots' folder. If the folder doesn't exist, it will be created."
  );
  logger.debug(
    "Also, make sure you add your bots before trying to start them. You can do this by running the 'add' command."
  );
  try {
    createFolders();
    loadDb();
    commandHandler();
  } catch (error) {
    logger.error(`${error}`);
  }
  logger.success("Manager loaded.");
  logger.success("Welcome to the bot manager!");
}

module.exports = loader;
