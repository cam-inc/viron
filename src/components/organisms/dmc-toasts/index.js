import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';

export default function() {
  const store = this.riotx.get();

  this.toasts = store.getter(getters.TOASTS);

  // TODO: riotx update後に修正すること。
  this.on('mount', () => {
    store.change(states.TOASTS, this.handleToastsStateChange);
  }).on('unmount', () => {
    store.off(states.TOASTS, this.handleToastsStateChange);
  });

  this.handleToastsStateChange = () => {
    this.toasts = store.getter(getters.TOASTS);
    this.update();
  };
}
