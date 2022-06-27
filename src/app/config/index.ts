/*
|--------------------------------------------------------------------------
| Config Services
|--------------------------------------------------------------------------
| This file is used to register the configuration services.
| The configuration services are used to load the configuration files.
| The configuration files are used to set the application configuration.
*/

import confif___app from './app.config';
import config___file from './file.config';
import config___mail from './mail.config';

/**
 * Register the configuration services.
 */
export default [confif___app, config___file, config___mail];