const axios = require('axios');
const cheerio = require('cheerio');
const url = "http://www.mercator10.com.br/public/search?faixa_valor_request=0-0&goalId=1&tipo=2&faixa_valor=0-1300&ref=";
const db = require("./db");
const url_base = "mercator10.com.br";

(async function func() {
    dados = await db.findImovelPartialLink(url_base);
    while(true){
        avancar = 3; //quantidade de paginas para avançar
        prox = true;
        try{
            let endereco = url + "&timestamp=" + Date.now();
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
                let links = $('.swt-realty-preview a');
                
                for(let link of links) {
                    let href = $(link).attr('href');
                    if(href != undefined){
                        cont++;
                        try{
                            href = "http://www.mercator10.com.br"+href;
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
                    let proxima = $("[title='Ir para próxima página']").attr('href');
                    if(proxima != undefined){
                        endereco = "http://www.mercator10.com.br/public/search" + proxima + "&timestamp=" + Date.now();
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



//http://www.mercator10.com.br/?tipo=1&ref=&goalId=1&max=12&faixa_valor_request=&faixa_valor=0-0&timestamp=1644272810773&offset=12&timestamp=1644272819012
//http://www.mercator10.com.br/public/search?tipo=1&ref=&goalId=1&max=12&faixa_valor_request=&faixa_valor=0-0&timestamp=1644272810773&offset=12