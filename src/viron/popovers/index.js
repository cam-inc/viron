import { constants as getters } from '../../store/getters';
import { constants as states } from '../../store/states';

export default function() {
  const store = this.riotx.get();

  this.popovers = store.getter(getters.POPOVERS);
  this.listen(states.POPOVERS, () => {
    this.popovers = store.getter(getters.POPOVERS);
    this.update();
  });
}
