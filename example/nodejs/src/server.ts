import errorHandler from 'errorhandler';
import { createApplication } from './application';

const app = createApplication();

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
    '@viron/demo/node is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});
