const loader = require("./handlers/loader");
const { prompt } = require("enquirer");
const logger = require("./utils/logger");
const processHandler = require("./handlers/processHandler");
loader();
processHandler();

async function startBotManager() {
  while (true) {
    try {
      const commandQuestion = await prompt({
        type: "input",
        name: "command",
        message: "Enter a command (start, add, remove, killall, exit): ",
      });

      const selectedCommand = commandQuestion.command;

      switch (selectedCommand) {
        case "start":
          const startCommand = require("./commands/start");
          await startCommand.execute();
          break;
        case "add":
          const addCommand = require("./commands/add");
          await addCommand.execute();
          break;
        case "remove":
          const removeCommand = require("./commands/remove");
          await removeCommand.execute();
        case "killall":
          const killallCommand = require("./commands/killall");
          await killallCommand.execute();
          break;
        case "exit":
          logger.info("Exiting bot manager.");
          process.exit();
          break;
        default:
          logger.error("Invalid command.");
          break;
      }
    } catch (error) {
      logger.error(`${error}`);
    }
  }
}

startBotManager();
