const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://abvaleimoveis.com.br/imoveis?pretensao=alugar&tipos=23&bairros=&valor_max=1.300";
const db = require("./db");
const url_base = "abvaleimoveis.com.br";

(async function func() {
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
                let links = $('.block-imoveis-list a');
                
                for(let link of links) {
                    let href = $(link).attr('href');
                    if(href != undefined){
                        href = "https://abvaleimoveis.com.br" + href;
                        cont++;
                        try{
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
                    let proxima = $('.pagination a:last');
                    response = await axios("https:" + $(proxima).attr('href') + "&timestamp=" + Date.now());
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