import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
// Configure AWS SDK with your credentials
const region = dotenv.config().parsed?.AWS_REGION;
const accessKeyId = dotenv.config().parsed?.AWS_ACCESS_KEY_ID;
const secretAccessKey = dotenv.config().parsed?.AWS_SECRET_ACCESS_KEY;
export interface S3Config {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}
export class UploadFile {
  private s3Client: S3Client;
  private config: S3Config;
  constructor(config: S3Config) {
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    });
    this.config = config;
  }

  async listBuckets() {
    try {
      const data = await this.s3Client.send(new ListBucketsCommand({}));
      console.log("Success", data.Buckets);
      return data.Buckets;
    } catch (err) {
      console.log("Error", err);
    }
  }
  async uploadFile(file: File, fileName: string) {
    const params = {
      Bucket:this.config.bucketName,
      Key: fileName,
      Body: file,
    };
    try {
      const data = await this.s3Client.send(new PutObjectCommand(params));
      console.log("Success", data);
      return data;
    } catch (err) {
      console.log("Error", err);
    }
  }
}
