async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://root:toor@localhost:3306/imoveis");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function endConnection(){
    const conn = await connect();
    conn.end();
    return;
}

async function selectImoveis(){
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM imoveis;');
    return rows;
}

async function findImovel(link){
    const conn = await connect();
    const sql = 'SELECT * FROM imoveis WHERE link = (?);';
    const values = [link];
    const [rows] = await conn.query(sql, values);
    return rows;
}

async function findImovelPartialLink(link){
    const conn = await connect();
    const sql = 'SELECT link FROM imoveis WHERE link like "%' + link + '%";';
    const [rows] = await conn.query(sql);
    return rows;
}

async function insertImoveis(link){
    const conn = await connect();
    let sql = 'INSERT INTO imoveis(link) VALUES (?);';
    let values = [link];
    return await conn.query(sql, values);
    //sql = 'INSERT INTO notificacoes(link, status) VALUES (?,?);';
    //values = [link, 0];
    //await conn.query(sql, values);
    
}

async function findNotifications(){
    const conn = await connect();
    const sql = 'SELECT * FROM notificacoes WHERE status = 0;';
    const [rows] = await conn.query(sql);
    return rows;
}

async function updateNotification(id){
    const conn = await connect();
    const sql = 'UPDATE notificacoes SET status=1 WHERE imoveis_id=?';
    const values = [id];
    return await conn.query(sql, values);
}

module.exports = {selectImoveis, insertImoveis, endConnection, findImovel, updateNotification, findNotifications, findImovelPartialLink}
