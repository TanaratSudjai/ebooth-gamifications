import { PutObjectCommand,S3Client } from "@aws-sdk/client-s3";
import mime from "mime-types";
import fs from "fs/promises";
import path from "path";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadQR(input, key) {
  let fileBuffer;
  let contentType = "application/octet-stream";

  if (Buffer.isBuffer(input)) {
    // ✅ Directly passed a buffer (like QR code)
    fileBuffer = input;
    contentType = mime.lookup(key) || "application/octet-stream";
  } else if (typeof input === "string") {
    // ✅ File path string
    fileBuffer = await fs.readFile(input);
    contentType = mime.lookup(input) || "application/octet-stream";
  } else {
    throw new Error("uploadToR2 only supports Buffer or file path string.");
  }

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    ContentLength: fileBuffer.length,
  });

  await s3.send(command);

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
