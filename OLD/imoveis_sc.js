const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
//TELEGRAM
const TelegramBot = require('node-telegram-bot-api');
const token = '5184974923:AAGYGG4lOWyI5tf8IwIkBCE1JGjhm7wxgwA';
const bot = new TelegramBot(token, {polling: true});
//
const screen = {
    width: 1024,
    height: 720
  };

(async function imoveis_sc() {
  const db = require("./db");
  let driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options().headless().windowSize(screen))
  .build();
  
  
  while(true){
    cont = 0;
    await driver.get('https://www.imoveis-sc.com.br/blumenau/alugar/casa?ordenacao=recentes&valor=-1300');
    try {
        avancar = 3; //quantidade de paginas para avançar
        prox = true;
        while(prox && avancar > 0){
          let links = await driver.findElements({css:'.imovel-titulo > a:link'});
          for(let link of links) {
              cont++;
              let text = await link.getAttribute("href");
              //verifico se já existe
              try{
                const imoveis = await db.findImovel(text);
                if(await imoveis.length == 0){
                  await db.insertImoveis(text);
                  console.log(cont + " " + text);
                  bot.sendMessage(1664301324, text);
                }
              }catch(e){
                  console.log(e);
              }
          }
          avancar--;
          try{
            let proxima = await driver.findElement({css:'.next'}).getAttribute("href");
            driver.get(proxima);
          }catch{
            prox = false;
          }
        }
      }catch(e){
          console.log(e);
      }
      await new Promise(resolve => setTimeout(resolve, 10000));
  }
  await driver.quit();
  await db.endConnection();
})();
