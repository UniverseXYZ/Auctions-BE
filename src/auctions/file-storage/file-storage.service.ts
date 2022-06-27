import { Injectable, Logger } from "@nestjs/common";
import S3Client from "aws-sdk/clients/s3";
import fs from "fs";
import { UploadResult } from "./model/UploadResult";
import { DeleteResult } from "./model/DeleteResult";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      accessKeyId: this.configService.get("accessKeyId"),
      secretAccessKey: this.configService.get("secretAccessKey"),
    });
  }
  private client: S3Client;

  public getUrl(key: string) {
    return key && `${this.configService.get("s3BaseUrl")}/${key}`;
  }

  public uploadDocument(
    sourcePath: string,
    bucketPath: string,
    mimeType?: string
  ) {
    return new Promise<UploadResult>((resolve, reject) => {
      const stream = fs.createReadStream(sourcePath);
      this.client.upload(
        {
          Bucket: this.configService.get("bucketName"),
          Key: bucketPath,
          Body: stream,
          ContentType: mimeType || "application/octet-stream",
        },
        (error, data) => {
          if (error) {
            Logger.log(error);
            reject(error);
          } else {
            resolve(UploadResult.fromAws(data));
          }
        }
      );
    });
  }
  public uploadBuffer(sourceBuffer: Buffer, bucketPath: string) {
    return new Promise<UploadResult>((resolve, reject) => {
      this.client.upload(
        {
          Bucket: this.configService.get("bucketName"),
          Key: bucketPath,
          Body: sourceBuffer,
        },
        (error, data) => {
          if (error) {
            Logger.log(error);
            reject(error);
          } else {
            resolve(UploadResult.fromAws(data));
          }
        }
      );
    });
  }

  public deleteImage(fileName: string) {
    return new Promise<DeleteResult>((resolve, reject) => {
      this.client.deleteObject(
        {
          Bucket: this.configService.get("bucketName"),
          Key: fileName,
        },
        (err, data) => {
          if (err) {
            Logger.log(err);
            reject(err);
          } else {
            resolve(DeleteResult.fromAws(data));
          }
        }
      );
    });
  }
}
