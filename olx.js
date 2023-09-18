const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://sc.olx.com.br/norte-de-santa-catarina/regiao-do-vale-do-itajai/imoveis/aluguel/casas?pe=1300&sd=2453&sd=2480&sf=1";
const db = require("./db");
const url_base = "sc.olx.com.br";

(async function olx3() {
    dados = await db.findImovelPartialLink(url_base);
    while(true){
        //console.log(dados);
        avancar = 3; //quantidade de paginas para avançar
        prox = true;
        try{
            let response = await axios(url + "&timestamp=" + Date.now()).catch((err) => console.log(err));
            let cont = 0;
            while(prox && avancar > 0){
                
                if(response.status !== 200){
                    console.log("Error occurred while fetching data");
                    continue;
                }

                const html = response.data;
                const $ = cheerio.load(html);
                let links = $('#ad-list li');
                
                for(let link of links) {
                    let href = $(link).find('a').attr('href');
                    if(href != undefined){
                        cont++;
                        try{
                            //const imoveis = await db.findImovel(href);
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
                try{
                    let proxima = $('[data-lurker-detail=next_page]');
                    response = await axios($(proxima + "&timestamp=" + Date.now()).attr('href')).catch((err) => console.log(err));
                }catch{
                    prox = false;
                }

            }
        }catch(e){
            console.log(e);  
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
})();