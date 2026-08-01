import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const required = [
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_R2_ACCESS_KEY_ID",
  "CLOUDFLARE_R2_SECRET_ACCESS_KEY",
  "CLOUDFLARE_R2_BUCKET_NAME",
  "CLOUDFLARE_R2_PUBLIC_URL",
];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(`Missing Cloudflare R2 env variables: ${missing.join(", ")}`);
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME;
export const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL.replace(/\/$/, "");

console.log("🪣 R2 Config:", {
  bucket: R2_BUCKET,
  publicUrl: R2_PUBLIC_URL,
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID ? "Loaded ✅" : "Missing ❌",
});
