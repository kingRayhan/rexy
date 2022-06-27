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
  at_secret: process.env.JWT_SECRET || 'at_secret',

  /*
    |--------------------------------------------------------------------------
    | Refresh token secret
    |--------------------------------------------------------------------------
    |
    | This value is the secret used to sign the refresh token.
    | Set this in your ".env" file.
    | If not set, the default value is "rt_secret".
    */
  rt_secret: process.env.JWT_SECRET || 'rt_secret',
}));
