const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.dinamicasul.com.br/search?_token=cmbyWyZDJFrsT1KFlZYWLMReBaJUSaowv8lfsA5R&negocio=2&tipo%5B%5D=Casa&cidade=4202404&minprice=&maxprice=1.300%2C00";
const db = require("./db");
const url_base = "dinamicasul.com.br";

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
                let links = $('.feat_property > .thumb > a');
                
                for(let link of links) {
                    let href = $(link).attr('href');
                    if(href != undefined){
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
                prox = false;

            }
        }catch(e){
            console.log(e);  
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
})();