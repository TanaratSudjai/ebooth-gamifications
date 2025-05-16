import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function deleteFromR2(key) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
  });

  await s3.send(command);
}
