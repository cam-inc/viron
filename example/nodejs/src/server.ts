import https from 'https';
import { ctx, logger } from './context';
import { createApplication } from './application';
import { getCertificate } from './helpers/ssl';

logger.info(`Set mode. mode=${ctx.mode}`);

const main = async (): Promise<void> => {
  await ctx.preflight();
  const app = await createApplication();
  const server = https.createServer(await getCertificate(), app);

  /**
   * Start Express server.
   */
  server.listen(app.get('port'), () => {
    logger.info(
      '@viron/example/nodejs is running at https://localhost:%d in %s mode',
      app.get('port'),
      app.get('env')
    );
    logger.info('  Press CTRL-C to stop\n');
  });
};

main();
