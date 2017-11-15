import { constants as states } from '../../store/states';

export default function() {
  const store = this.riotx.get();

  this.popovers = store.getter('popovers.all');
  this.listen(states.POPOVERS, () => {
    this.popovers = store.getter('popovers.all');
    this.update();
  });
}
