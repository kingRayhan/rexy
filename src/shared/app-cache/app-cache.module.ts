import { Module } from '@nestjs/common';
import { AppCacheService } from './app-cache.service';

@Module({
  providers: [AppCacheService],
  exports: [AppCacheService],
})
export class AppCacheModule {}
