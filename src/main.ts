import { NestFactory } from "@nestjs/core";
import { AuctionsModule } from "./auctions/auctions.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuctionsModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get("port") || 8080;
  const sessionSecret = config.get("session_secret");
  app.setGlobalPrefix("v1", {
    exclude: [""],
  });
  // Middlewares
  app.use(helmet());
  app.enableCors();
  // Swagger Documentation
  const options = new DocumentBuilder()
    .setTitle("Auctions API")
    .setDescription("Auctions API Documentation")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("v1/doc", app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  if (!sessionSecret) {
    throw new Error("No session secret");
  }

  const sessionOptions = {
    secret: <string>sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  };

  if (config.get("app_env") === "production") {
    sessionOptions.cookie.secure = true;
  }

  app.use(session(sessionOptions));

  await app.listen(port);
}
bootstrap();
