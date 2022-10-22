import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => ({
  /*
    |--------------------------------------------------------------------------
    | CORS
    |--------------------------------------------------------------------------
    |
    | This value is the time in seconds that the refresh token will be valid.   
    | Set this in your ".env" file.
    | If not set, the default value is '1d'.
    |
    */
  origin: process.env.CORS_ORIGIN || '*',
}));
