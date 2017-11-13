import { constants as actions } from '../../../store/actions';
import './menu/index.tag';

export default function() {
  const store = this.riotx.get();

  this.handleMenuTap = e => {
    e.stopPropagation();
    const rect = this.refs.menu.getBoundingClientRect();
    store.action(actions.POPOVERS_ADD, 'viron-endpoints-page-endpoint-menu', {
      endpoint: this.opts.endpoint
    }, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      direction: 'TL'
    });
  };
}
