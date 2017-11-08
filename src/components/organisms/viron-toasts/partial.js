import { constants as actions } from '../../../store/actions';

export default function() {
  const store = this.riotx.get();

  let autoHideTimerID;

  this.show = () => {
    // need to set delay after dom mountation.
    setTimeout(() => {
      this.root.classList.add('Toast--visible');
    }, 100);
  };

  this.hide = () => {
    this.root.classList.remove('Toast--visible');

    // call action after the hide animation completes.
    setTimeout(() => {
      store.action(actions.TOASTS_REMOVE, this.opts.id);
    }, 1000);
  };

  this.on('mount', () => {
    this.show();

    if (this.opts.autohide) {
      autoHideTimerID = setTimeout(() => {
        this.hide();
      }, this.opts.timeout);
    }
  });

  this.on('unmount', () => {
    clearTimeout(autoHideTimerID);
  });

  this.handleClick = () => {
    clearTimeout(autoHideTimerID);
    this.hide();
  };

  this.handleLinkClick = () => {
    window.open(this.opts.link);
  };
}
