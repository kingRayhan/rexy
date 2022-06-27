import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forRoot(
      'mongodb+srv://rayhan:rayhan123@cluster0.dymuq.mongodb.net/rexy-test?retryWrites=true&w=majority',
    ),
  ],
})
export class TestDatabaseModule {}
