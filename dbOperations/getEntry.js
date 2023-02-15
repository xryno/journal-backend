const AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-west-2",
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const userTable = "journal-entries";
const common = require("../utils/common");

async function getEntries(userId) {
  const params = {
    TableName: userTable,
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": userId },
  };
  const allEntries = await scanDynamoRecords(params, []);
  const body = {
    entries: allEntries,
  };
  return common.httpResponse(200, body);

  async function scanDynamoRecords(scanParams, itemArray) {
    //check if last all data has been returned, if not get more data, recursive
    try {
      const dynamoData = await dynamoDB.scan(scanParams).promise();
      itemArray = itemArray.concat(dynamoData.Items);
      if (dynamoData.LastEvaluatedKey) {
        scanParams.ExclusiveStartKey = dynamoData.LastEvalutedKey;
        return await scanDynamoRecords(scanParams, itemArray);
      }
      return itemArray;
    } catch (error) {
      console.error("There was an error", error);
    }
  }
}

module.exports.getEntries = getEntries;
