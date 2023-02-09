import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppCacheService {
  private loagger = new Logger(AppCacheService.name);

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Remember a value in the cache
   * @param key - The key to store the value in the cache
   * @param callback - The callback to execute to get the value
   * @param ttl - The time to live in milliseconds
   * @returns
   */
  async rememberCallback(
    key: string,
    callback: () => any,
    ttl: number = 60 * 1000 * 60 * 24,
  ) {
    if (this.configService.get('app.cache') === 'false') {
      return callback();
    }

    const cachedData = await this.redis.get(
      `${this.configService.get('app.name')}:${key}`,
    );
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const data = await callback();
    await this.setValue(key, data, ttl);
    return data;
  }

  /**
   * Forget a key from the cache
   * @param key - The key to forget
   * @returns
   */
  async forget(key: string) {
    const keys = await this.redis.keys(
      `${this.configService.get('app.name')}:${key}`,
    );

    if (!keys.length) {
      return this.loagger.log(`Key ${key} not found in cache`);
    }
    return this.redis.del(keys, (err, count) => {
      if (err) {
        this.loagger.error(err);
      }
      this.loagger.log(`Deleted cache key ${key} with count ${count}`);
    });
  }

  /**
   * Store a value in the cache
   * @param key - The key to store the value in the cache
   * @param value - The value to store in the cache
   * @param ttl - The time to live in milliseconds
   * @returns
   */
  setValue(key: string, value: any, ttl: number = 60 * 1000) {
    return this.redis.set(
      `${this.configService.get('app.name')}:${key}`,
      JSON.stringify(value),
      'PX',
      ttl,
      (err, result) => {
        if (err) {
          this.loagger.error(err);
        }
        this.loagger.log(`Set cache key ${key} with result ${result}`);
      },
    );
  }

  /**
   * Forget all keys from the cache
   * @returns
   * @todo - This is not working
   */
  flush() {
    return this.redis.flushall();
  }
}
