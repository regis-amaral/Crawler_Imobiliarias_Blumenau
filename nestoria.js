const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.nestoria.com.br/blumenau/casas/aluguel?price_max=1300&sort=newest";
const db = require("./db");
const url_base = "nestoria.com.br";

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
                let links = $('.results__link');
                
                for(let link of links) {
                    let href = $(link).attr('data-href');
                    
                    if(href != undefined){
                        cont++;
                        try{
                            href = "https://www.nestoria.com.br"+href.split("?")[0];
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
            //console.log(e);  
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
})();



//https://www.nestoria.com.br/detail/0000005230005643279441177/title/1/1-24?serpUid=0.7817941050711644266571&pt=3&ot=2&l=blumenau&did=68_default&t_sec=206&t_or=1&t_pvid=0512a6b2-03fd-4d43-83ff-946b2ccb676c
//https://www.nestoria.com.br/detail/0000005230005643279441177/title/1/1-24?serpUid=0.92942905103611644266599&pt=3&ot=2&l=blumenau&did=68_default&t_sec=206&t_or=1&t_pvid=b02611b3-2fab-48ee-a9c7-f34c0ee9a849