dmc-modal(class="Modal Modal--{ opts.theme }" click="{ handleClick }")
  .Modal__frame(click="{ handleFrameClick }")
    .Modal__closeButton(click="{ handleCloseButtonClick }")
      dmc-icon(type="close")
    .Modal__content(ref="content")

  script.
    import ObjectAssign from 'object-assign';
    import constants from '../../core/constants';
    import '../atoms/dmc-icon.tag';

    const store = this.riotx.get();
    let tag;

    this.on('mount', () => {
      tag = riot.mount(this.refs.content, this.opts.tagname, ObjectAssign({
        isModal: true,
        modalCloser: this.hide
      }, this.opts.tagopts))[0];
      this.show();
      window.addEventListener('keydown', this.handleKeyDown);
    });

    this.on('before-unmount', () => {
      tag.unmount(true);
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
