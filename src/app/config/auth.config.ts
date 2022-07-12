import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  /*
    |--------------------------------------------------------------------------
    | Access token secret
    |--------------------------------------------------------------------------
    |
    | This value is the secret used to sign the access token.
    | Set this in your ".env" file.
    | If not set, the default value is "at_secret".
*/
  access_token_secret: process.env.ACCESS_TOKEN_SECRET || 'at_secret',

  /*
    |--------------------------------------------------------------------------
    | Access token expiration time
    |--------------------------------------------------------------------------
    |
    | This value is the time in seconds that the access token will be valid.
    | Set this in your ".env" file.
    | If not set, the default value is '1h'.
*/
  access_token_expiration: process.env.ACCESS_TOKEN_LIFETIME || '1h',

  /*
    |--------------------------------------------------------------------------
    | Refresh token secret
    |--------------------------------------------------------------------------
    |
    | This value is the secret used to sign the refresh token.
    | Set this in your ".env" file.
    | If not set, the default value is "rt_secret".
    */
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || 'rt_secret',

  /*
    |--------------------------------------------------------------------------
    | Refresh token expiration time
    |--------------------------------------------------------------------------
    |
    | This value is the time in seconds that the refresh token will be valid.
    | Set this in your ".env" file.
    | If not set, the default value is '1d'.
    */
  refresh_token_expiration: process.env.REFRESH_TOKEN_LIFETIME || '1d',
}));
