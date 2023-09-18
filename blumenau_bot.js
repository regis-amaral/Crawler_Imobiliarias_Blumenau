const db = require("./db");
const TelegramBot = require('node-telegram-bot-api');
const token = ''; //algo como 5184974923:AAGYGG4lOWyI5tf8IwIkBCE1JGjhm7wxgwA
const bot = new TelegramBot(token, {polling: true});

(async function blumenau_bot() {
    while(true){
        cont = 0;
        let notificacoes = await db.findNotifications();
        if(notificacoes.length > 0){
            for(let notif of notificacoes) {
                cont++;
                console.log(cont + " - " + notif.link);
                try{
                    await bot.sendMessage(1664301324, notif.link);
                    await db.updateNotification(notif.imoveis_id);
                }catch(e){
                    await new Promise(resolve => setTimeout(resolve, 6000));
                    continue;
                }
            }
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
})();
