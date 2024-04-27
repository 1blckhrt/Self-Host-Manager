const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

function checkCommandModule(filePath) {
  const commandModule = require(filePath);

  if (
    typeof commandModule !== "object" ||
    typeof commandModule.execute !== "function" ||
    typeof commandModule.name !== "string" ||
    typeof commandModule.description !== "string"
  ) {
    logger.error(`Invalid command module found at ${filePath}`);
    return false;
  }

  return true;
}

function checkCommandModules(dirPath) {
  const absolutePath = path.resolve(__dirname, "..", dirPath);

  const files = fs.readdirSync(absolutePath);

  let allModulesValid = true;

  files.forEach((file) => {
    const filePath = path.join(absolutePath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile() && path.extname(file) === ".js") {
      const isValid = checkCommandModule(filePath);
      allModulesValid = allModulesValid && isValid;
    }
  });

  if (allModulesValid) {
    logger.success("All command modules are valid.");
  } else {
    logger.error("Some command modules are invalid.");
  }
}

async function commandHandler() {
  checkCommandModules("commands");
}

module.exports = { commandHandler };
