/*
|--------------------------------------------------------------------------
| Config Services
|--------------------------------------------------------------------------
| This file is used to register the configuration services.
| The configuration services are used to load the configuration files.
| The configuration files are used to set the application configuration.
*/

import config___app from './app.config';
import config___auth from './auth.config';
import config___cors from './cors.config';
import config___file from './file.config';
import config___mail from './mail.config';
import config___database from './database.config';

/**
 * Register the configuration services.
 */
export default [
  config___app,
  config___cors,
  config___auth,
  config___file,
  config___mail,
  config___database,
];
