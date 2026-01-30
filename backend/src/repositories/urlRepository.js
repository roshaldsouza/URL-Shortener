const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMO_TABLE;

// Save short URL mapping
async function saveUrl(shortCode, longUrl) {
  try {
    console.log("Saving to DynamoDB:", shortCode, longUrl);

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        shortCode,
        longUrl,
        clickCount: 0,
        createdAt: new Date().toISOString(),
      },
    });

    await ddb.send(command);
    return shortCode;
  } catch (error) {
    console.error("Error saving URL to DynamoDB:", error);
    throw error;
  }
}

// Find long URL and increment click count
async function findUrl(shortCode) {
  try {
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: { shortCode },
    });

    const result = await ddb.send(getCommand);

    if (!result.Item) {
      return null;
    }

    const updateCommand = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { shortCode },
      UpdateExpression: "SET clickCount = clickCount + :inc",
      ExpressionAttributeValues: {
        ":inc": 1,
      },
    });

    await ddb.send(updateCommand);

    return result.Item.longUrl;
  } catch (error) {
    console.error("Error fetching URL from DynamoDB:", error);
    throw error;
  }
}

module.exports = { saveUrl, findUrl };
