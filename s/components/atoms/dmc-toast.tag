dmc-toast(class="Toast Toast--{ opts.type }" click="{ handleClick }")
  div { opts.id } / { opts.type} / { opts.message }

  script.
    import constants from '../../core/constants';

    const store = this.riotx.get();
    let autoHideTimerID;

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

    show() {
      setTimeout(() => {
        this.root.classList.add('Toast--visible');
      }, 0);
    }

    hide() {
      this.root.classList.remove('Toast--visible');

      setTimeout(() => {
        store.action(constants.ACTION_TOAST_HIDE, this.opts.id)
      }, 1000);
    }

    handleClick() {
      clearTimeout(autoHideTimerID);
      this.hide();
    }
