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
    // `tag` = a tag instance that will be shown inside this modal.
    let tag;

    this.on('mount', () => {
      // mount a tag to the reserved area(i.e. this.refs.content) and store returned tag instance.
      tag = riot.mount(this.refs.content, this.opts.tagname, ObjectAssign({
        // boolean to tell the inner tag instance that it is wrapped in this modal.
        isModal: true,
        // function to close this modal. this is the only way for the inner tag instance to close this modal.
        modalCloser: this.fadeOut
      }, this.opts.tagopts))[0];
      this.fadeIn();
      window.addEventListener('keydown', this.handleKeyDown);
    });

    this.on('before-unmount', () => {
      // unmount the inner tag instance manually so `unmount flow` will be processed exactly with correct order.
      tag.unmount(true);
    });

    this.on('unmount', () => {
      window.removeEventListener('keydown', this.handleKeyDown);
    });

    // fade in with animation.
    fadeIn() {
      setTimeout(() => {
        this.root.classList.add('Modal--visible');
      }, 100);
    }

    // fade out with animation.
    // once completed, automatically remove this modal.
    fadeOut() {
      this.root.classList.remove('Modal--visible');

      setTimeout(() => {
        store.action(constants.ACTION_MODAL_HIDE, this.opts.id);
      }, 1000);
    }

    handleClick() {
      this.fadeOut();
    }

    handleFrameClick(e) {
      e.stopPropagation();
    }

    handleCloseButtonClick() {
      this.fadeOut();
    }

    handleKeyDown(e) {
      switch (e.keyCode) {
        case 27: `Esc`
          this.fadeOut();
          break;
        default:
          break;
      }
    }
