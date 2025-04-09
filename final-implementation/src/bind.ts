import { appEnv } from 'config/app-env';
import logger from 'utils/logger';

import { red, bold } from 'colorette';

export type ServerBind =
  | { type: 'port'; port: number }
  | { type: 'pipe'; pipe: string };

export function getBind(): ServerBind {
  const val = appEnv.PORT;

  if (!val) {
    logger.warn(
      red(
        `Env variable ${bold('PORT')} not defined. Defaulting to port ${bold('8080')}`,
      ),
    );
    return { type: 'port', port: 8080 };
  }

  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return { type: 'pipe', pipe: val };
  }

  if (port >= 0) {
    // port number
    return { type: 'port', port };
  }

  throw new Error(`Invalid value for env variable \`PORT\`: ${val}`);
}
