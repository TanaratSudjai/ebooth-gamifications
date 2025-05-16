import fs from "fs";
import mime from "mime-types"; // install if missing with `npm i mime-types`
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(filePath, key) {
  const fileStream = fs.createReadStream(filePath);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: fileStream,
    ContentType: mime.lookup(filePath) || "application/octet-stream",
  });

  await s3.send(command);

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
