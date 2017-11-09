import { constants as getters } from '../../store/getters';
import { constants as states } from '../../store/states';

export default function() {
  const store = this.riotx.get();

  this.modals = store.getter(getters.MODALS);
  this.listen(states.MODALS, () => {
    this.modals = store.getter(getters.MODALS);
    this.update();
  });
}
