const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

function createFolders() {
  return new Promise((resolve, reject) => {
    const parentDir = path.resolve(__dirname, "../../");

    const botsFolder = path.join(parentDir, "bots");
    const logsFolder = path.join(parentDir, "logs");

    // Check if both folders exist
    const botsFolderExists = fs.existsSync(botsFolder);
    const logsFolderExists = fs.existsSync(logsFolder);

    if (botsFolderExists && logsFolderExists) {
      // Folders already exist
      resolve(true);
    } else {
      // Create folders if they don't exist
      if (!botsFolderExists) {
        fs.mkdir(botsFolder, (err) => {
          if (err) {
            logger.error(`Failed to create folder 'bots'.\n${err}`);
            reject(err);
          } else {
            checkCompletion();
          }
        });
      }

      if (!logsFolderExists) {
        fs.mkdir(logsFolder, (err) => {
          if (err) {
            logger.error(`Failed to create folder 'logs'.\n${err}`);
            reject(err);
          } else {
            checkCompletion();
          }
        });
      }

      function checkCompletion() {
        // Check if both folders are created
        const botsFolderExistsNow = fs.existsSync(botsFolder);
        const logsFolderExistsNow = fs.existsSync(logsFolder);

        if (botsFolderExistsNow && logsFolderExistsNow) {
          // Both folders are created, resolve the promise
          resolve(false);
        }
      }
    }
  });
}

module.exports = { createFolders };
