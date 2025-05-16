import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// app/api/r2-image/route.js or route.ts

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: 'ebooth',
      Key: `member_ranks/${filename}`,
    });

    const response = await s3.send(command);
    const stream = response.Body;

    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': response.ContentType || 'application/octet-stream',
        'Content-Length': response.ContentLength?.toString() || undefined,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'File not found or error fetching' }, { status: 404 });
  }
}


// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const filename = searchParams.get('filename');

//   if (!filename) {
//     return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
//   }

//   const filePath = path.join(process.cwd(), 'tmp', 'uploads', 'member_ranks', filename);

//   console.log('[Looking for file at]:', filePath);

//   if (!fs.existsSync(filePath)) {
//     return NextResponse.json({ error: 'File not found' }, { status: 404 });
//   }

//   const fileBuffer = fs.readFileSync(filePath);
//   const mimeType = mime.lookup(filePath) || 'application/octet-stream';

//   return new NextResponse(fileBuffer, {
//     status: 200,
//     headers: {
//       'Content-Type': mimeType,
//     },
//   });
// }
