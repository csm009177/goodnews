import { S3Client } from "@aws-sdk/client-s3";

let s3Client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!s3Client) {
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const accountId = process.env.R2_ACCOUNT_ID;

    if (!accessKeyId || !secretAccessKey || !accountId) {
      throw new Error("R2 credentials are not set");
    }

    s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return s3Client;
}

export function getR2BucketName(): string {
  return process.env.R2_BUCKET_NAME || "goodnews";
}
