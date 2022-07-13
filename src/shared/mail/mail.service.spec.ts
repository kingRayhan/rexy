import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configs from '../../app/config';
import { MAIL_TEMPLATES } from './contracts/MAIL_TEMPLATES.enum';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
        }),
      ],
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('MailService.sendMail', () => {
    it('send a text mail', async () => {
      const info = await service.sendMail({
        to: 'rayhan095@gmail.com',
        subject: 'Test',
        text: 'Test',
      });

      expect(info.messageId).toBeDefined();
      expect(info.envelope.to).toContain('rayhan095@gmail.com');
    });

    it('send a html mail', async () => {
      const info = await service.sendMail({
        to: 'rayhan095@gmail.com',
        subject: 'Html Mail',
        html: '<h1>Test</h1>',
      });

      expect(info.messageId).toBeDefined();
      expect(info.envelope.to).toContain('rayhan095@gmail.com');
    });
  });

  describe('MailService.renderTemplate', () => {
    it('render a mail template', async () => {
      const html = service.renderTemplate(MAIL_TEMPLATES.WELCOME);
      expect(html).toBeDefined();
      console.log({ html });
    });
  });
});
