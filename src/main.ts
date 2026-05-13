import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { Logger } from 'nestjs-pino';
import { resolve } from 'path';
import * as yaml from 'yaml';

import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
    .setTitle('Plan-my-trip backend api')
    .setDescription(
      'API documentation for a sample app. For development purposes only.',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  const document = documentFactory();

  // Export YAML
  const yamlStr = yaml.stringify(document);
  const filePath = resolve(__dirname, '../../openapi.yaml');
  writeFileSync(filePath, yamlStr, { encoding: 'utf8' });
  console.log('✅ openapi.yaml generated at', filePath);

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 5001);
}

bootstrap();
