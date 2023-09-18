const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://quintal.imb.br/imoveis-locacao.php?tipo%5B%5D=Casa+Residencial&cidade=BLUMENAU&codigo_imovel=&area_minima=&area_maxima=&valor_minimo=&valor_maximo=1300&qtd_quartos=&qtd_suites=&qtd_vagas=";
const db = require("./db");
const url_base = "quintal.imb.br";

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
                let links = $('.property-listing .property-item .imagem');
                
                for(let link of links) {
                    let href = $(link).attr('href');
                    if(href != undefined){
                        cont++;
                        try{
                            href = "https://quintal.imb.br/"+href;
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
                        endereco = "https://quintal.imb.br/" + proxima + "&timestamp=" + Date.now();
                        console.log(endereco);
                        response = await axios(endereco).catch((err) => console.log(err));
                    }
                }catch(e){
                    //console.log(e);
                    prox = false;
                }

            }
        }catch(e){
            //console.log(e);  
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
})();