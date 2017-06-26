import { constants as getters } from '../store/getters';
import { constants as states } from '../store/states';

export default function() {
  const store = this.riotx.get();

  const isEnabled = store.getter(getters.MENU_ENABLED);
  const isOpened = store.getter(getters.MENU_OPENED);
  this.isMenuOpened = isEnabled && isOpened;
  // 表示すべきページの名前。
  this.pageName = store.getter(getters.LOCATION_NAME);
  // 表示すべきページのルーティング情報。
  this.pageRoute = store.getter(getters.LOCATION_ROUTE);

  this.listen(states.APPLICATION, () => {
    this.isLaunched = store.getter(getters.APPLICATION_ISLAUNCHED);
    this.isNavigating = store.getter(getters.APPLICATION_ISNAVIGATING);
    this.isNetworking = store.getter(getters.APPLICATION_ISNETWORKING);
    this.isBlocked = this.isLaunched && !this.isNavigating && !this.isNetworking;
    this.update();
  });
  this.listen(states.LOCATION, () => {
    this.pageName = store.getter(getters.LOCATION_NAME);
    this.pageRoute = store.getter(getters.LOCATION_ROUTE);
    this.update();
  });
  this.listen(states.MENU, () => {
    const isEnabled = store.getter(getters.MENU_ENABLED);
    const isOpened = store.getter(getters.MENU_OPENED);
    this.isMenuOpened = isEnabled && isOpened;
    this.update();
  });
}
