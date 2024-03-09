//importing the sdk isn't optimal for the overhead, but it is fine for now.
var AWS = require('aws-sdk');
AWS.config.update({region: "us-east-1"});
var ddb = new AWS.DynamoDB();

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

    //Add data to DynamoDB

    var params = {
        TableName: 'battery-monitor-data',
        Item: {
          'DeviceID' : {S: body['coreid']},
          'Data': {S: body['data']},
          'Timestamp' : {S: body['published_at'] }
        }
      };
      
      // Call DynamoDB to add the item to the table
      ddb.putItem(params, function(err, data) {
        if (err) {
          done(new Error(`something went wrong with dynamodb`));
          console.log("DynamoDB Error", err);
        } else {
          console.log("DynamoDB Success", data);
          done(null, 'Data inserted.');
        }
      });

};