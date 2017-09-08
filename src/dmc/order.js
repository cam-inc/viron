import { constants as getters } from '../store/getters';
import { constants as states } from '../store/states';

export default function() {
  const store = this.riotx.get();

  this.endpoints = store.getter(getters.ENDPOINTS_BY_ORDER);

  this.listen(states.ENDPOINTS, () => {
    this.endpoints = store.getter(getters.ENDPOINTS_BY_ORDER);
    this.update();
  });
}
