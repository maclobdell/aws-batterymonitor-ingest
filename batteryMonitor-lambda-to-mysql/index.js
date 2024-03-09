const mysql = require('mysql');
const con = mysql.createConnection({
    host : process.env.RDS_HOSTNAME,
    user : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port : process.env.RDS_PORT,
    database : process.env.RDS_DATABASE
});
exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const body = JSON.parse(event['body']);
    console.info("BODY\n" + JSON.stringify(body, null, 2));
    
    const sql = "INSERT INTO `ParticleDeviceData` (event, data, coreid, published_at) VALUES ('"
    + body['event']+"','"
    + body['data']+"','"
    + body['coreid']+"','"
    + body['published_at'] + "')";
    
    con.query(sql, (err, res) => {
        if (err) {
           done(new Error(`something went wrong`));
        }
        done(null, '1 records inserted.');
    });
};