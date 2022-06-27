import { Injectable, Logger } from "@nestjs/common";
import S3Client from "aws-sdk/clients/s3";
import fs from "fs";
import { UploadResult } from "./model/UploadResult";
import { DeleteResult } from "./model/DeleteResult";
import { ConfigService } from "@nestjs/config";
import { S3_ERROR } from "src/utils/constants";

@Injectable()
export class S3Service {
  private accessKeyId: string;
  private secretAccessKey: string;
  private s3BaseUrl: any;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.accessKeyId = this.configService.get("accessKeyId");
    this.secretAccessKey = this.configService.get("secretAccessKey");
    this.s3BaseUrl = this.configService.get("s3BaseUrl");
    this.bucketName = this.configService.get("bucketName");

    if (
      !this.accessKeyId ||
      !this.secretAccessKey ||
      !this.s3BaseUrl ||
      !this.bucketName
    ) {
      throw new Error(S3_ERROR);
    }

    this.client = new S3Client({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
  }
  private client: S3Client;

  public getUrl(key: string) {
    return key && `${this.s3BaseUrl}/${key}`;
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
          Bucket: this.bucketName,
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
