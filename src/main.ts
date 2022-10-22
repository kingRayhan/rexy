import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cowsay from 'cowsay';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import validationOptions from './app/utils/validation-options';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.get('app.prefix'), {
    exclude: ['/'],
  });

  const options = new DocumentBuilder()
    .setTitle(config.get('app.name'))
    .setDescription(config.get('app.description'))
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.get('app.doc'), app, document);

  /**
   * Enable cors
   */
  app.enableCors({
    origin: true,
    credentials: true,
  });

  /**
   * Validation Pipe for formating validation error
   */
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  /**
   * boot the app porting the config.port
   */
  const port = config.get('app.port');
  await app.listen(port);

  /**
   * Print the application name and environment.
   */
  console.log(
    cowsay.say({
      text: `App is running at ${config.get('app.url')} | Doc: ${config.get(
        'app.url',
      )}/${config.get('app.doc')}`,
    }),
  );
}
bootstrap();
