import { constants as getters } from '../../store/getters';
import { constants as states } from '../../store/states';

export default function() {
  const store = this.riotx.get();

  this.menu = store.getter(getters.VIRON_MENU);
  this.listen(states.VIRON, () => {
    this.menu = store.getter(getters.VIRON_MENU);
    this.update();
  });

  this.handleLogoTap = () => {
    this.getRouter().navigateTo('/');
  };
}
