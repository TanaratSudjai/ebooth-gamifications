import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import mime from "mime-types";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(filePath, key) {
  const fileBuffer = await fs.readFile(filePath);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: mime.lookup(filePath) || "application/octet-stream",
    ContentLength: fileBuffer.length,
  });

  await s3.send(command);

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
