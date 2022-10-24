import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('/')
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get('/')
  boot() {
    return {
      message: 'Welcome to the API',
      api_doc: `${this.config.get('app.url')}/${this.config.get('app.doc')}`,
    };
  }
}
