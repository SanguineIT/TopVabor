import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ValidationFilter } from './exception/validation-exception.filter';
import * as express from 'express';
import { join } from 'path';
import { MulterExceptionFilter } from './exception/multer-execption.filter';
import { QueryFailedExceptionFilter } from './exception/http-exception.filter.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  // app.use(express.static(join(__dirname, '../upload/'))); //For Local 
  app.use('/api', express.static(join(__dirname, 'upload'))); //For Live Server file upload

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //create swagger ui
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      skipMissingProperties: false,
      skipNullProperties: true,
      exceptionFactory: ValidationFilter,
    }),
  );

  // app.useGlobalFilters(new MulterExceptionFilter());
  app.useGlobalFilters(new QueryFailedExceptionFilter());

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('topvabor')
    .setDescription('The topvabor API description')
    .setVersion('1.0')
    .addTag('topvabor')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/swagger', app, document, {
    customSiteTitle: 'topvabor',
  });

  await app.listen(process.env.Port || 3000);
}
bootstrap();
