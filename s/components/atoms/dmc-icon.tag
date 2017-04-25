dmc-icon(class="{ classes }")
  script.
    this.classes = {
      Icon: true,
      [`Icon--${opts.type}`]: true,
      [opts.class]: true
    };
