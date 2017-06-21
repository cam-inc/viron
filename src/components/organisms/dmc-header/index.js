import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';

export default function() {
  const store = this.riotx.get();

  this.isMenuEnabled = store.getter(getters.MENU_ENABLED);
  this.isMenuOpened = store.getter(getters.MENU_OPENED);

  // TODO: riotx update後に修正すること。
  this.on('mount', () => {
    store.change(states.MENU, this.handleMenuStateChange);
  }).on('unmount', () => {
    store.off(states.MENU, this.handleMenuStateChange);
  });

  this.handleMenuStateChange = () => {
    this.isMenuEnabled = store.getter(getters.MENU_ENABLED);
    this.isMenuOpened = store.getter(getters.MENU_OPENED);
    this.update();
  };

  this.handleMenuButtonTap = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.MENU_TOGGLE));
  };

  this.handleHomeButtonTap = () => {
    this.getRouter().navigateTo('/');
  };
}
