import ObjectAssign from 'object-assign';
import riot from 'riot';

export default function() {
  const store = this.riotx.get();

  // `tag` = drawer内に展開されるriot tagインスタンス。
  let tag;

  const fadeIn = () => {
    setTimeout(() => {
      this.root.classList.add('Drawer--visible');
    }, 100);
  };

  const fadeOut = () => {
    this.root.classList.remove('Drawer--visible');

    setTimeout(() => {
      store.action('drawers.remove', this.opts.id);
    }, 1000);
  };

  this.on('mount', () => {
    tag = riot.mount(this.refs.content, this.opts.tagname, ObjectAssign({
      isDrawer: true,
      drawerCloser: this.fadeOut
    }, this.opts.tagopts))[0];
    fadeIn();
    window.addEventListener('keydown', this.handleKeyDown);
  }).on('before-unmount', () => {
    tag.unmount(true);
  }).on('unmount', () => {
    window.removeEventListener('keydown', this.handleKeyDown);
  });

  this.handleTap = e => {
    if (!e.target.classList.contains('Drawer')) {
      return;
    }
    fadeOut();
  };

  this.handleKeyDown = e => {
    switch (e.keyCode) {
    case 27:// Esc
      this.fadeOut();
      break;
    default:
      break;
    }
  };
}
