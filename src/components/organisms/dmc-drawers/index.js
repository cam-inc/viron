import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';

export default function() {
  const store = this.riotx.get();

  this.drawers = store.getter(getters.DRAWERS);

  // TODO: riotx update後に修正すること。
  this.on('mount', () => {
    store.change(states.DRAWERS, this.handleDrawersStateChange);
  }).on('unmount', () => {
    store.off(states.DRAWERS, this.handleDrawersStateChange);
  });

  this.handleDrawersStateChange = () => {
    this.drawers = store.getter(getters.DRAWERS);
    this.update();
  };
}
