const { prompt } = require("enquirer");
const { readDb, writeDb } = require("../utils/dbFunctions");
const logger = require("../utils/logger");
const path = require("path");
const { execSync } = require("child_process");

module.exports = {
  name: "killall",
  description: "Kills all bot processes.",
  execute: async function () {
    const db = readDb("db.json");
    const bots = db.bots;

    if (!bots || bots.length === 0) {
      logger.error(
        "No bots found. Please add your bots to the bot folder and run the 'add' command."
      );
    } else {
      logger.info(
        "Executing this command will kill all running instances of the bots in your Bots folder. Are you sure you want to continue? (y/n): "
      );

      const selectOption = await prompt({
        type: "select",
        name: "confirmKill",
        message: "Are you sure you want to kill all bots?",
        choices: ["y", "n"],
      });

      const choices = selectOption.confirmKill;

      if (choices === "y") {
        try {
          // Kill all bot processes
          bots.forEach((bot) => {
            logger.info(`Killing bot: ${bot.name}`);
            const botName = bot.name;
            const botPath = bot.path;
            const indexPath = path.resolve(
              __dirname,
              "..",
              "..",
              "bots",
              botName,
              botPath
            );
            const botProcesses = execSync(
              `ps aux | grep "node ${indexPath}" | grep -v "grep" | awk '{print $2}'`
            )
              .toString()
              .split("\n")
              .filter((x) => x !== "");

            botProcesses.forEach((pid) => {
              console.log(`Killing process: ${pid}`);
              execSync(`kill ${pid}`);
            });
          });

          // Bot killing completed, return to index.js
          logger.success("All bots killed.");
        } catch (error) {
          logger.error(`Failed to kill all bots.`);
          logger.error(`${error}`);
        }
      } else {
        logger.info("Kill cancelled.");
        // No action needed, return to index.js
      }
    }

    return;
  },
};
