import crypto from "crypto";

// Generate a unique ID (can be used for general purposes)
function generateUniqueId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate a transaction ID (alias, in case PaymentController specifically needs it)
function generateTransactionId() {
  return generateUniqueId();
}

// Create HMAC SHA256 hash and encode in Base64
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
