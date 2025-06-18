import { createServer } from 'https';
import { createApplication } from './application';
import { SERVICE_ENV } from './constants';
import { ctx, logger } from './context';
import { getCertificate } from './helpers/ssl';

logger.info(`Set mode. mode=${ctx.mode}`);

const main = async (ssl: boolean): Promise<void> => {
  await ctx.init();

  const app = await createApplication();
  const options = ssl ? await getCertificate() : {};
  const server = createServer(options, app);

  /**
   * Start Express server.
   */
  server.listen(app.get('port'), () => {
    logger.info(
      '@viron/example/nodejs is running on port %d in %s mode',
      app.get('port'),
      app.get('env')
    );
    logger.info('  Press CTRL-C to stop\n');
  });
};

main(process.env.SERVICE_ENV === SERVICE_ENV.LOCAL);
