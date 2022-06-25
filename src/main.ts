import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cowsay from 'cowsay';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.get('PORT') || 3000;
  await app.listen(port);

  console.log(cowsay.say({ text: `App is running at port ${port}` }));
}
bootstrap();
