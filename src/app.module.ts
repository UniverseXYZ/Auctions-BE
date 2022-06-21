import { Module } from "@nestjs/common";
import configuration from "./config";
import { ConfigModule } from "@nestjs/config";
import { TerminusModule } from "@nestjs/terminus";
import { DatabaseModule } from "./database/database.module";
import { DatabaseService } from "./database/database.service";
import { HealthModule } from "./health/health.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AuctionsModule } from "./auctions/auctions.module";
import { NftsModule } from "./nfts/nfts.module";
import { APP_FILTER } from "@nestjs/core";
import { ExceptionsFilter } from "./errors/exceptions.filter";

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
    AuctionsModule,
    NftsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule {}
