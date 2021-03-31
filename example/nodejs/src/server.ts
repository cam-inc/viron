import { ctx, logger } from './context';
import { createApplication } from './application';

logger.info(`Set mode. mode=${ctx.mode}`);

const main = async (): Promise<void> => {
  await ctx.preflight();
  const app = await createApplication();

  /**
   * Start Express server.
   */
  app.listen(app.get('port'), () => {
    console.log(
      '@viron/example/node is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('env')
    );
    console.log('  Press CTRL-C to stop\n');
  });
};

main();
