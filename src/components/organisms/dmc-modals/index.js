import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';

export default function() {
  const store = this.riotx.get();

  this.modals = store.getter(getters.MODALS);

  // TODO: riotx update後に修正すること。
  this.on('mount', () => {
    store.change(states.MODALS, this.handleModalsStateChange);
  }).on('unmount', () => {
    store.off(states.MODALS, this.handleModalsStateChange);
  });

  this.handleModalsStateChange = () => {
    this.modals = store.getter(getters.MODALS);
    this.update();
  };
}
