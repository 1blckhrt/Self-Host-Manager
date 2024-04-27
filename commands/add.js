const { prompt } = require("enquirer");
const { readDb, writeDb } = require("../utils/dbFunctions");
const logger = require("../utils/logger");

module.exports = {
  name: "add",
  description: "Add a bot to the JSON database enabling it to be started.",
  execute: async function () {
    const db = readDb("db.json");
    const bots = db.bots || []; // Ensure bots array exists
    const bot = {};

    const response = await prompt([
      {
        type: "input",
        name: "name",
        message:
          "Enter the bot name: (the folder name in the bots folder, case sensitive)",
      },
      {
        type: "input",
        name: "path",
        message:
          "Enter the bot file path to index.js relative to the corresponding bot folder (examples include index.js, src/index.js):",
      },
    ]);

    // Assign prompt responses to bot object
    bot.name = response.name;
    bot.path = response.path;

    // Push bot object into bots array
    bots.push(bot);

    // Update db with new bots array
    db.bots = bots;
    writeDb(db, "db.json");
    logger.success("Bot added.");
    return;
  },
};
