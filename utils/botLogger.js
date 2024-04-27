const logger = require("./logger");
const trim = require("./trim");

function captureBotLogs(botProcess, botName) {
  if (!botProcess || !botName) {
    return;
  }

  botProcess.stdout.on("data", (data) => {
    const trimmedData = trim(data);
    console.log(`[${botName}] ${trimmedData}`);
  });

  botProcess.stderr.on("data", (data) => {
    const trimmedData = trim(data);
    console.log(`[${botName}] ${trimmedData}`);
  });

  botProcess.on("close", (code) => {
    console.log(`[${botName}] process exited with code ${code}`);
  });
}

module.exports = captureBotLogs;
