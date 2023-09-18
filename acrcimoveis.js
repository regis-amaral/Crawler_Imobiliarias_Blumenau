const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.acrcimoveis.com.br/alugar/sc/blumenau/casa/valor-0_1300/ordem-valor/resultado-crescente/quantidade-24/";
const db = require("./db");
const url_base = "acrcimoveis.com.br";

(async function func() {
    dados = await db.findImovelPartialLink(url_base);
    while(true){
        avancar = 3; //quantidade de paginas para avançar
        prox = true;
        try{
            let endereco = url + "timestamp=" + Date.now();
            console.log(endereco);
            let response = await axios(endereco).catch((err) => console.log(err));
            let cont = 0;
            while(prox && avancar > 0){
                
                if(response.status !== 200){
                    console.log("Error occurred while fetching data");
                    continue;
                }
                
                const html = response.data;
                const $ = cheerio.load(html);
                let links = $('#lista .resultado > a');
                
                for(let link of links) {
                    let href = $(link).attr('href');
                    if(href != undefined){
                        cont++;
                        try{
                            href = "https://www.acrcimoveis.com.br/"+href;
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
                    let proxima = $("[aria-label='Next']").attr('href');
                    if(proxima != undefined){
                        endereco = "https://www.acrcimoveis.com.br" + proxima + "timestamp=" + Date.now();
                        console.log(endereco);
                        response = await axios(endereco).catch((err) => console.log(err));
                    }
                }catch(e){
                    console.log(e);
                    prox = false;
                }

            }
        }catch(e){
            //console.log(e);  
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
})();