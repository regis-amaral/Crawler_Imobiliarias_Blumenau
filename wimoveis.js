const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.wimoveis.com.br/casas-aluguel-blumenau-sc-menos-1300-reales-ordem-publicado-maior.html";
const db = require("./db");
const url_base = "wimoveis.com.br";

(async function func() {
    dados = await db.findImovelPartialLink(url_base);
    while(true){
        avancar = 3; //quantidade de paginas para avançar
        prox = true;
        let cont = 0;
        try{
            let response = await axios(url + "&timestamp=" + Date.now()).catch((err) => console.log(err));
            
            while(prox && avancar > 0){
                
                if(response.status !== 200){
                    console.log("Error occurred while fetching data");
                    continue;
                }

                const html = response.data;
                const $ = cheerio.load(html);
                let links = $('.list-card-container div');
                
                for(let link of links) {
                    let href = $(link).attr('data-to-posting');
                    if(href != undefined){
                        href = "https://www.wimoveis.com.br" + href;
                        cont++;
                        try{
                            //const imoveis = await db.findImovel(href);
                            //if(await imoveis.length == 0){
                            //    await db.insertImoveis(href);
                            //    console.log(cont + " " + href);
                            //
                            let existe = false;
                            for(let d of dados){
                                if(d.link == href){
                                    existe = true;
                                }
                            }
                            if(existe == false){
                                await db.insertImoveis(href);
                                dados.push({link:href})
                                console.log(cont + " " + href);
                            }
                          }catch(e){
                              console.log(e);
                          }
                    }    
                }

                avancar--;
                prox = false;

            }
        }catch(e){
            console.log(e);  
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
})();