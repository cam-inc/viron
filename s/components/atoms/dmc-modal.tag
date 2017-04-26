dmc-modal(class="Modal" click="{ handleClick }")
  .Modal__frame(click="{ handleFrameClick }")
    .Modal__closeButton(click="{ handleCloseButtonClick }")
      dmc-icon(type="close")
    .Modal__content
      div i am content of modal

  script.
    import constants from '../../core/constants';
    import '../atoms/dmc-icon.tag';

    const store = this.riotx.get();

    this.on('mount', () => {
      this.show();
      window.addEventListener('keydown', this.handleKeyDown);
    });

    this.on('unmount', () => {
      window.removeEventListener('keydown', this.handleKeyDown);
    });

    show() {
      setTimeout(() => {
        this.root.classList.add('Modal--visible');
      }, 100);
    }

    hide() {
      this.root.classList.remove('Modal--visible');

      setTimeout(() => {
        store.action(constants.ACTION_MODAL_HIDE, this.opts.id);
      }, 1000);
    }

    handleClick() {
      this.hide();
    }

    handleFrameClick(e) {
      e.stopPropagation();
    }

    handleCloseButtonClick() {
      this.hide();
    }

    handleKeyDown(e) {
      switch (e.keyCode) {
        case 27: `Esc`
          this.hide();
          break;
        default:
          break;
      }
    }
