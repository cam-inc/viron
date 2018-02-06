import pascalCase from 'mout/string/pascalCase';
import '../../../../../components/viron-error/index.tag';

export default function() {
  const store = this.riotx.get();

  this.isGoogle = (this.opts.authtype.provider === 'google');
  this.label = pascalCase(this.opts.authtype.provider);
  this.isMobile = store.getter('layout.isMobile');
  this.listen('layout', () => {
    this.isMobile = store.getter('layout.isMobile');
    this.update();
  });

  this.handleButtonTap = () => {
    this.opts.closer();
    Promise
      .resolve()
      .then(() => store.action('auth.signinOAuth', this.opts.endpointkey, this.opts.authtype))
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };
}
