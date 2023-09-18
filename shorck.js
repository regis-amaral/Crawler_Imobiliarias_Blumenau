const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.schorkimoveis.com.br/imoveis/para-alugar/casa/blumenau?preco-de-locacao=~1300";
const db = require("./db");
const url_base = "www.schorkimoveis.com.br";

(async function imoveis_sc() {
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
                let links = $('.listing-results .card');
                
                for(let link of links) {
                    let href = $(link).find('a').attr('href');
                    if(href != undefined){
                        href = "https://www.schorkimoveis.com.br" + href;
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
                    let proxima = $('.btn-next').attr('href');
                    if(proxima != undefined){
                        response = await axios("https://www.schorkimoveis.com.br"+ proxima  + "&timestamp=" + Date.now()).catch((err) => console.log(err));
                    }
                }catch(e){
                    console.log(e);
                    prox = false;
                }

            }
        }catch(e){
            console.log(e);  
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
})();