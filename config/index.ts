let config;

switch (process.env.ENV) {
  case "production":
    config = require("./env/prod") // for deploy-production
    break;

  default:
    config = require("./defaultConfig") // for run in localhost
    break;
}

module.exports = config;
