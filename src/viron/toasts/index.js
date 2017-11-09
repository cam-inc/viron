import { constants as getters } from '../../store/getters';
import { constants as states } from '../../store/states';

export default function() {
  const store = this.riotx.get();

  this.toasts = store.getter(getters.TOASTS);

  this.listen(states.TOASTS, () => {
    this.toasts = store.getter(getters.TOASTS);
    this.update();
  });
}
