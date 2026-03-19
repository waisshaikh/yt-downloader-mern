import mongoose from "mongoose";

let isConnected = false;

function cleanMongoUri(uri: string): string {
  const qIdx = uri.indexOf("?");
  if (qIdx === -1) return uri;

  const base = uri.slice(0, qIdx);
  const queryStr = uri.slice(qIdx + 1);

  const supportedParams = new Set([
    "authSource", "ssl", "tls", "tlsCAFile", "tlsCertificateKeyFile",
    "retryWrites", "w", "journal", "readPreference", "maxPoolSize",
    "minPoolSize", "socketTimeoutMS", "connectTimeoutMS",
    "serverSelectionTimeoutMS", "heartbeatFrequencyMS", "appName",
    "directConnection", "compressors", "zlibCompressionLevel",
    "authMechanism", "authMechanismProperties", "gssapiServiceName",
    "replicaSet",
  ]);

  const kept = queryStr
    .split("&")
    .filter((param) => {
      const [key] = param.split("=");
      return supportedParams.has(key);
    })
    .join("&");

  return kept ? `${base}?${kept}` : base;
}

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }

  const cleanUri = cleanMongoUri(uri);
  console.log("Connecting to MongoDB...");
  await mongoose.connect(cleanUri, {
    serverSelectionTimeoutMS: 10000,
  });
  isConnected = true;
  console.log("Connected to MongoDB");
}

export { mongoose };
export * from "./models";
