const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.imoveis-sc.com.br/blumenau/alugar/casa?ordenacao=recentes&valor=-1300";
const db = require("./db");
const url_base = "imoveis-sc";

(async function imoveis_sc() {
    dados = await db.findImovelPartialLink(url_base);
    while(true){
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
                let links = $('.imovel-titulo');
                
                for(let link of links) {
                    let href = $(link).find('a').attr('href');
                    if(href != undefined){
                        cont++;
                        try{
                            //const imoveis = await db.findImovel(href);
                            //if(await imoveis.length == 0){
                            //    await db.insertImoveis(href);
                            //    console.log(cont + " " + href);
                            //}

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
                    let proxima = $('.next');
                    response = await axios($(proxima).attr('href') + "&timestamp=" + Date.now()).catch((err) => console.log(err));
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