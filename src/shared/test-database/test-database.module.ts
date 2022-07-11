import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => {
        // const mongod = await MongoMemoryServer.create();
        // const uri = await mongod.getUri();
        return { uri: 'mongodb://localhost:27017/text-test' };
      },
    }),
  ],
})
export class TestDatabaseModule {}
