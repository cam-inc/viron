// 別ディレクトリからimportしていて良くない。
import '../../../viron/header/menu/entry/index.tag';

export default function() {
  const store = this.riotx.get();

  this.handleTap = () => {
    store.action('modals.add', 'viron-application-header-menu-entry');
  };
}
