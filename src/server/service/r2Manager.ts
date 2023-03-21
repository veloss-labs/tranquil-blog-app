import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env/server.mjs";
import type { FileUploadData } from "~/libs/validation/common";
import type { UserSchema } from "~/server/auth";

interface GetSignedUrlForPutObjectParams {
  key: string;
  fileType: string;
  fileSize?: number;
}

export class R2Manager {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: "auto",
      endpoint: env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });
  }

  public generateKey(user: UserSchema, body: FileUploadData) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${user.id}/${body.uploadType}/images/${body.filename}`;
  }

  public async getSignedUrlForPutObject({
    key,
    fileType,
    fileSize,
  }: GetSignedUrlForPutObjectParams): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      ContentLength: fileSize,
    });
    return getSignedUrl(this.s3Client, command, {
      expiresIn: parseInt(env.CLOUDFLARE_R2_EXPIRES),
    });
  }

  public concatUrl(key: string) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${env.CLOUDFLARE_R2_PUBLIC_URL}/assets/${key}`;
  }
}

export const r2Manager = new R2Manager();
