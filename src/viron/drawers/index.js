import { constants as states } from '../../store/states';

export default function() {
  const store = this.riotx.get();

  this.drawers = store.getter('drawers.all');

  this.listen(states.DRAWERS, () => {
    this.drawers = store.getter('drawers.all');
    this.update();
  });
}
