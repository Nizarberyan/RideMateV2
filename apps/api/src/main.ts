import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as express from "express";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  });

  // Use Pino Logger for all NestJS core logging
  app.useLogger(app.get(Logger));

  // Raise body size limit to 5MB to support base64-encoded profile photos
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ limit: "5mb", extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3001);
  const logger = app.get(Logger);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Database URL: ${process.env.DATABASE_URL}`);
}
void bootstrap();
