import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as express from "express";
import { Logger } from "nestjs-pino";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('RideMate API')
    .setDescription('The RideMate Backend API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3001);
  const logger = app.get(Logger);
  const url = await app.getUrl();
  logger.log(`Application is running on: ${url}`);
  logger.log(`Swagger documentation: ${url}/api/docs`);
  logger.log(`Database URL: ${process.env.DATABASE_URL}`);
}
void bootstrap();
