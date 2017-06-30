import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';

export default function() {
  const store = this.riotx.get();

  this.name = store.getter(getters.PAGE_NAME);
  this.components = store.getter(getters.PAGE_COMPONENTS);

  this.listen(states.PAGE, () => {
    this.name = store.getter(getters.PAGE_NAME);
    this.components = store.getter(getters.PAGE_COMPONENTS);
    this.update();
  });
}
