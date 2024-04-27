const { prompt } = require("enquirer");
const { spawn } = require("child_process");
const path = require("path");
const { readDb } = require("../utils/dbFunctions");
const logger = require("../utils/logger");
const captureBotLogs = require("../utils/botLogger");

module.exports = {
  name: "start",
  description: "Starts a bot using the JSON Database.",
  execute: async function () {
    const db = readDb("db.json");
    const bots = db.bots;

    if (!bots || bots.length === 0) {
      logger.error(
        "No bots found. Please add your bots to the bot folder and run the 'add' command."
      );
      return;
    }

    const botNames = bots.map((bot) => bot.name);
    const response = await prompt({
      type: "select",
      name: "botName",
      message: "Select a bot to start:",
      choices: botNames,
    });

    const selectedBotName = response.botName;
    const selectedBot = bots.find((bot) => bot.name === selectedBotName);

    if (!selectedBot) {
      logger.error("Invalid bot selection.");
      return;
    }

    logger.info(`Starting bot: ${selectedBot.name}`);

    try {
      // Construct the absolute path to the bot's file
      const botFilePath = path.resolve(
        __dirname,
        "..",
        "..",
        "bots",
        selectedBot.name,
        selectedBot.path
      );

      // Start the bot process
      const botProcess = spawn("node", [botFilePath]);
      logger.success(`Bot started: ${selectedBot.name}`);

      captureBotLogs(botProcess, selectedBot.name);
    } catch (error) {
      logger.error(error);
      return;
    }
  },
};
