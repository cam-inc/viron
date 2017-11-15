import { constants as states } from '../../store/states';

export default function() {
  const store = this.riotx.get();

  this.toasts = store.getter('toasts.all');

  this.listen(states.TOASTS, () => {
    this.toasts = store.getter('toasts.all');
    this.update();
  });
}
