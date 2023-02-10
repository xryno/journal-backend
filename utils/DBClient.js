require('dotenv').config()
const AWS = require('aws-sdk');
const settings = {
    region: 'eu-west-2'
}

if (process.env.AWS_SAM_LOCAL) {
    settings.endpoint = new AWS.Endpoint(process.env.LOCAL_ENDPOINT)
}

 const client = new AWS.DynamoDB.DocumentClient(settings);

 module.exports.client = client;