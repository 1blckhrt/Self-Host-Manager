const logger = require("../utils/logger");

module.exports = () => {
  // Crtl + C
  process.on("SIGINT", () => {
    logger.error("SIGINT: Closing...");
    process.exit();
  });

  // Standard crash
  process.on("uncaughtException", (err) => {
    logger.error(`UNCAUGHT EXCEPTION: ${err.stack}`);
  });

  // Killed process
  process.on("SIGTERM", () => {
    logger.error("SIGTERM: Closing...");
    process.exit();
  });

  // Standard crash
  process.on("unhandledRejection", (err) => {
    logger.error(`UNHANDLED REJECTION: ${err.stack}`);
  });

  // Deprecation warnings
  process.on("warning", (warning) => {
    logger.warn(`WARNING: ${warning.name} : ${warning.message}`);
  });

  // Reference errors
  process.on("uncaughtReferenceError", (err) => {
    logger.error(err.stack);
  });

  process.on("exit", () => {
    console.log("Process exiting...");
  });
};
