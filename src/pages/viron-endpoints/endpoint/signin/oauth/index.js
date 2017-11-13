import { constants as actions } from '../../../../../store/actions';
import '../../../../../components/viron-error/index.tag';

export default function() {
  const store = this.riotx.get();

  this.handleButtonSelect = () => {
    this.opts.closer();
    Promise
      .resolve()
      .then(() => store.action(actions.AUTH_SIGNIN_OAUTH, this.opts.endpointkey, this.opts.authtype))
      .catch(err => store.action(actions.MODALS_ADD, 'viron-error', {
        error: err
      }));
  };
}
