import { constants as states } from '../../store/states';

export default function() {
  const store = this.riotx.get();

  this.closer = () => {
    this.close();
  };

  this.menu = store.getter('viron.menu');
  this.listen(states.VIRON, () => {
    this.menu = store.getter('viron.menu');
    this.update();
  });

  this.handleLogoTap = () => {
    this.close();
    this.getRouter().navigateTo('/');
  };
}
