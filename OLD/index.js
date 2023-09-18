//index.js
(async () => {
    const db = require("./db");
    console.log('Começou!');
    
    //console.log('INSERT INTO IMOVEIS');
    //const result = await db.insertImoveis({link: "https://www.imoveis-sc.com.br/blumenau/alugar/casa/itoupava-central/casa-blumenau-itoupava-central-985964.html"});
    //console.log(result);
 
    //console.log('SELECT * FROM IMOVEIS');
    //try{
    //    const imoveis = await db.selectImoveis();
    //    console.log(imoveis[0].link);
    //}catch(e){
    //    console.log(e);
    //}

    try{
        const imovel = await db.findImovel(2);
        console.log(imovel.length);
    }catch(e){
        console.log(e);
    }

    await db.endConnection();
})();