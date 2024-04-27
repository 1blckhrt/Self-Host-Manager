const { prompt } = require("enquirer");
const { execSync } = require("child_process");
const path = require("path");
const { readDb, writeDb } = require("../utils/dbFunctions");
const logger = require("../utils/logger");

module.exports = {
  name: "remove",
  description:
    "Removes a bot from the JSON database and kills it if it's running.",
  execute: async function () {
    const db = readDb("db.json");
    const bots = db.bots || []; // Ensure bots array exists

    if (!bots || bots.length === 0) {
      logger.error(
        "No bots found. Please add your bots to the bot folder and run the 'add' command."
      );
      return;
    }

    const botNames = bots.map((bot) => bot.name);

    if (botNames.length === 0) {
      logger.error("There are no bots available for removal.");
      return;
    }

    let response;
    if (botNames.length === 1) {
      response = { botName: botNames[0] }; // Automatically select the only available bot
    } else {
      response = await prompt({
        type: "select",
        name: "botName",
        message: "Select a bot to remove:",
        choices: botNames,
      });
    }

    const botName = response.botName;
    const selectedBot = bots.find((bot) => bot.name === botName);

    if (!selectedBot) {
      logger.error("Invalid bot selection.");
      return;
    }

    const botFilePath = path.resolve(
      __dirname,
      "..",
      "..",
      "bots",
      `${selectedBot.name}`,
      `${selectedBot.path}`
    );

    // Check if bot is running
    const botProcesses = execSync(
      `ps aux | grep "node ${botFilePath}" | grep -v "grep" | awk '{print $2}'`
    )
      .toString()
      .split("\n")
      .filter((x) => x !== "");

    if (botProcesses.length > 0) {
      logger.info("Bot is running. Killing bot...");
      botProcesses.forEach((pid) => {
        execSync(`kill ${pid}`);
      });
    }

    // Remove bot from bots array
    const botIndex = bots.findIndex((bot) => bot.name === botName);
    bots.splice(botIndex, 1);

    // Update db with new bots array
    writeDb(db, "db.json");

    logger.success("Bot removed.");
  },
};
