import { constants as actions } from '../../store/actions';
import '../autocomplete/index.tag';

export default function() {
  const store = this.riotx.get();

  // 補完吹き出しを表示します。
  const openAutocompletePopover = () => {
    const rect = this.refs.searchIcon.getBoundingClientRect();
    store.action(actions.POPOVERS_ADD, 'viron-application-autocomplete', null, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      direction: 'TL'
    });
  };

  this.handleSearchIconTap = () => {
    openAutocompletePopover();
  };
}
