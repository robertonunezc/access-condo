import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { FailedToUpload } from "../../errors/exceptions";

export interface UploadBackend {
  upload(
    path: string,
    stream: Readable,
    contentType: string,
    fileName?: string
  ): Promise<string>;

  download(path: string): Promise<DownloadResponse>;

  inspect(path: string, modifiedAfter?: Date): Promise<FileMetadata | null>;

  nativeUrl(path: string): Promise<string>;
}
export interface FileMetadata {
  fileName: string;
  contentType: string;
  sizeBytes: number;
}
export interface DownloadResponse {
  stream: Readable;
  metadata: FileMetadata;
}
export interface S3Config {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}
export class UploadFile  implements UploadBackend {

  constructor(
    readonly client: S3Client,
    readonly bucket: string,
    readonly prefix: string
  ) {}


  async listBuckets() {
    try {
      const data = await this.client.send(new ListBucketsCommand({}));
      console.log("Success", data.Buckets);
      return data.Buckets;
    } catch (err) {
      console.log("Error", err);
    }
  }
  async upload(path: string, stream: Readable, contentType: string, fileName?: string): Promise<string> {
    const params = {
      Bucket:this.bucket,
      Key: fileName,
      Body: stream,
    };
    try {
        const data = await this.client.send(new PutObjectCommand(params));
      console.log("Success", data);
      return fileName ?? "file-name";
    } catch (err) {
      console.log("Error", err);
      throw new FailedToUpload("Failed to upload file");
    }
  }

  async download(path: string): Promise<DownloadResponse> {
    throw new Error(`Method not implemented.${path}`);
  }
  
  async inspect(path: string, modifiedAfter?: Date): Promise<FileMetadata | null> {
    throw new Error(`Method not implemented.${path}, modifiedAfter: ${modifiedAfter}`);
  }
  async nativeUrl(path: string): Promise<string> {
    throw new Error(`Method not implemented.${path}`);
  }
}