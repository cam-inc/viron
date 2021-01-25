import errorHandler from 'errorhandler';
import { ctx, logger } from './context';
import { createApplication } from './application';

logger.info(`Set mode. mode=${ctx.mode}`);

ctx.preflight();
const app = createApplication();
console.log('aaaaaaaa')

/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
export const server = app.listen(app.get('port'), () => {
  console.log(
    '@viron/example/node is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});
