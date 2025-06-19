import { createServer as createHttpServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { createApplication } from './application';
import { SERVICE_ENV } from './constants';
import { ctx, logger } from './context';
import { getCertificate } from './helpers/ssl';

logger.info(`Set mode. mode=${ctx.mode}`);

const main = async (ssl: boolean): Promise<void> => {
  await ctx.init();

  const app = await createApplication();
  const server = ssl
    ? createHttpsServer(await getCertificate(), app)
    : createHttpServer(app);

  /**
   * Start Express server.
   */
  server.listen(app.get('port'), () => {
    logger.info(
      '@viron/example/nodejs is running on http(s)://%s:%d in %s mode',
      app.get('host'),
      app.get('port'),
      app.get('env')
    );
    logger.info('  Press CTRL-C to stop\n');
  });
};

main(process.env.SERVICE_ENV === SERVICE_ENV.LOCAL);
