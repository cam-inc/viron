import { constants as states } from '../../store/states';

export default function() {
  const store = this.riotx.get();

  this.endpoints = store.getter('endpoints.allByOrderFiltered');

  this.listen(states.ENDPOINTS, () => {
    this.endpoints = store.getter('endpoints.allByOrderFiltered');
    this.update();
  });
}
