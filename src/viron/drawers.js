import { constants as getters } from '../store/getters';
import { constants as states } from '../store/states';

export default function() {
  const store = this.riotx.get();

  this.drawers = store.getter(getters.DRAWERS);

  this.listen(states.DRAWERS, () => {
    this.drawers = store.getter(getters.DRAWERS);
    this.update();
  });
}
