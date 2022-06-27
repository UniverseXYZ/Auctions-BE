import { Module } from "@nestjs/common";
import { S3Service } from "./file-storage.service";

@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export class FileStorageModule {}
