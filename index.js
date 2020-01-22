require('dotenv').config();
const log4js = require('log4js');

const logger = log4js.getLogger();

const Bot = require('./Bot');
const server = require('./webservice/server');

(async () => {
  try {
    const token = process.env.DISCORD_TOKEN;
    const bot = new Bot(token);
    await bot.connect();
  } catch (ex) {
    logger.error(ex.message);
  }
})();
