import { constants as states } from '../../store/states';

export default function() {
  const store = this.riotx.get();

  this.modals = store.getter('modals.all');
  this.listen(states.MODALS, () => {
    this.modals = store.getter('modals.all');
    this.update();
  });
}
