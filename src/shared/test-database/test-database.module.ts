import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
@Module({
  imports: [
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        // uri: config.get('database.test_url'),
        uri: `mongodb+srv://rayhan:rayhan123@cluster0.dymuq.mongodb.net/rexy-test?retryWrites=true&w=majority`,
      }),
    }),
  ],
})
export class TestDatabaseModule {}
