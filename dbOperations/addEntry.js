const AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-west-2",
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const userTable = "journal-entries";
const common = require("../utils/common");

async function addEntry(entry) {
  const email = entry.email;

  const entryToAdd = {
    ...entry,
    entryId: Math.floor(Date.now() / 1000).toString(),
  };

  const saveUserRes = await saveEntry(entryToAdd, email);

  if (!saveUserRes) {
    return common.httpResponse(503, { message: "Error" });
  }

  return common.httpResponse(200);
}

async function saveEntry(entryToAdd) {
  const params = {
    TableName: userTable,
    Item: entryToAdd,
  };

  return await dynamoDB
    .put(params)
    .promise()
    .then(
      () => {
        return true;
      },
      (error) => {
        console.error("There was an error", error);
      }
    );
}

module.exports.addEntry = addEntry;
