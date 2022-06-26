import { registerAs } from '@nestjs/config';

/**
 * File path to the configuration file.
 */
export default registerAs('app', () => ({
  /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application. This value is used when the
    | framework needs to place the application's name in a notification or
    | any other location as required by the application or its packages.
    |
    */
  name: process.env.APP_NAME || 'tadashi-api',
  /*
    |--------------------------------------------------------------------------
    | Application Description
    |--------------------------------------------------------------------------
    | This value is the description of your application. This value is used when
    | the framework needs to place the application's description in a notification
    | or any other location as required by the application or its packages.
    */
  description: process.env.APP_DESC || 'A boilerplate for nestjs',

  /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | Services the application utilizes. Set this in your ".env" file.
    |
    */
  env: process.env.NODE_ENV || 'development',

  /*
    |--------------------------------------------------------------------------
    | Application PORT
    |--------------------------------------------------------------------------
    | This value determines the port that the application will run on.
    | Set this in your ".env" file.
    | If not set, the default value is 3000.
    */
  port: process.env.PORT || 3000,

  /*
    |--------------------------------------------------------------------------
    | Api Prefix
    |--------------------------------------------------------------------------
    | This value determines the prefix of the API.
    | Set this in your ".env" file.
    | If not set, the default value is "api".
    */
  prefix: process.env.APP_PREFIX || 'api',
  /*
    |--------------------------------------------------------------------------
    | Application Documentation Url suffix (e.g. /docs)
    |--------------------------------------------------------------------------
    | This value determines the suffix of the API documentation url.
    | Set this in your ".env" file.
    | If not set, the default value is "docs".
    */
  doc: process.env.APP_DOC || 'docs',

  /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    | This value determines the url that the application will run on.
    | Set this in your ".env" file.
    | If not set, the default value is http://localhost:4000.
    */
  url: process.env.BACKEND_DOMAIN || 'http://localhost:4000',

  /*
    |--------------------------------------------------------------------------
    | Frontend URL
    |--------------------------------------------------------------------------
    | This value determines the url that the frontend will run on.
    | Set this in your ".env" file.
    | If not set, the default value is http://localhost:3000.
    */
  frontendUrl: process.env.FRONTEND_DOMAIN || 'http://localhost:3000',

  /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is used by the Illuminate encrypter service and should be set
    | to a random, 32 character string, otherwise these encrypted strings
    | will not be safe. Please do this before deploying an application!
    |
    */
  key: process.env.APP_KEY,
}));
