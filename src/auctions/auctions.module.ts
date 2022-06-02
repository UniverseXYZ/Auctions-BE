import { Module } from "@nestjs/common";
import { AuctionsService } from "./auctions.service";
import { AuctionsController } from "./auctions.controller";
import { MongooseModule } from "@nestjs/mongoose";
import configuration from "../config";
import { ConfigModule } from "@nestjs/config";
import { TerminusModule } from "@nestjs/terminus";
import { DatabaseModule } from "../database/database.module";
import { DatabaseService } from "../database/database.service";
import { HealthModule } from "src/health/health.module";
import { Auctions, AuctionsSchema } from "./schemas/auction.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      ignoreEnvVars: false,
      isGlobal: true,
      load: [configuration],
    }),
    TerminusModule,
    MongooseModule.forRootAsync({
      imports: [DatabaseModule],
      useExisting: DatabaseService,
    }),
    HealthModule,
    MongooseModule.forFeature([
      {
        name: Auctions.name,
        schema: AuctionsSchema,
      },
    ]),
  ],
  providers: [AuctionsService],
  controllers: [AuctionsController],
})
export class AuctionsModule {}
