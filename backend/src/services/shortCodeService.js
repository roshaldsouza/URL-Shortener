const crypto = require("crypto");
const { saveUrl, findUrl } = require("../repositories/urlRepository");

const URL_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function generateShortCode(length = 6) {
  const bytes = crypto.randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += URL_ALPHABET[bytes[i] % 64];
  }
  return code;
}

async function createShortUrl(longUrl) {
  const shortCode = generateShortCode(6);
  await saveUrl(shortCode, longUrl);
  return shortCode;
}

async function getLongUrl(shortCode) {
  return await findUrl(shortCode);
}

module.exports = { createShortUrl, getLongUrl };
