import crypto from "crypto";


function generateUniqueId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateTransactionId() {
  return generateUniqueId();
}


function generateHmacSha256Hash(data, secret) {
  if (!data || !secret) {
    throw new Error("Both data and secret are required to generate a hash.");
  }

  return crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64");
}

export { generateUniqueId, generateTransactionId, generateHmacSha256Hash };
