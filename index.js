require('dotenv').config();
const Bot = require('./Bot');

(async () => {
    
    
    try {        
        const token = process.env.DISCORD_TOKEN;
        const bot = new Bot(token);
        await bot.connect();
    } catch(ex) {
        console.log(ex.message);
    }    
})();

