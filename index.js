require('dotenv').config();
const log4js = require('log4js');
const { REST } = require('discord.js');

const logger = log4js.getLogger();

const Bot = require('./Bot');

(async () => {
  try {
    const token = process.env.DISCORD_TOKEN;
    const rest = new REST({ version: '10' }).setToken(token);
    const bot = new Bot(token, rest);
    await bot.connect();
  } catch (ex) {
    logger.error(ex.message);
  }
})();
