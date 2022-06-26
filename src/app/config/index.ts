/*
|--------------------------------------------------------------------------
| Config Services
|--------------------------------------------------------------------------
| This file is used to register the configuration services.
| The configuration services are used to load the configuration files.
| The configuration files are used to set the application configuration.
*/

import confif___app from '@tadashi-config/app.config';
import config___file from '@tadashi-config/file.config';
import config___mail from '@tadashi-config/mail.config';

/**
 * Register the configuration services.
 */
export default [confif___app, config___file, config___mail];
