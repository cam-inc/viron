import '../../../../../components/viron-error/index.tag';

export default function() {
  const store = this.riotx.get();

  this.handleButtonSelect = () => {
    this.opts.closer();
    Promise
      .resolve()
      .then(() => store.action('auth.signinOAuth', this.opts.endpointkey, this.opts.authtype))
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };
}
