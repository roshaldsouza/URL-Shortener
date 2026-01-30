const serverless = require("serverless-http");
const app = require("./app");

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  try {
    return await handler(event, context);
  } catch (error) {
    console.error("Lambda handler error:", error);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
