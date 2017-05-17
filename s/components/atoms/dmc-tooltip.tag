dmc-tooltip.Tooltip
  .Tooltip__wrapper
    .Tooltip__triangle
    .Tooltip__contentWrapper
      .Tooltip__content { opts.message }

  script.
    show() {
      // need to set delay after dom mountation.
      new Promise(resolve => {
        setTimeout(() => {
          this.root.classList.add('Tooltip--visible');
          resolve();
        }, 0);
      }).then(() => {
        this.root.classList.add('Tooltip--active');
      });
    }

    this.on('mount', () => {
      this.show();
    });
