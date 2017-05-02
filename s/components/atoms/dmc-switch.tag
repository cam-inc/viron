dmc-switch(class="Switch { opts.isactive ? 'Switch--active' : '' } { opts.isdisabled ? 'Switch--disabled' : ''}" click="{ handleClick }")
  .Switch__content
    .Switch__toggle
      .Switch__groove
      .Switch__knob
    virtual(if="{ !!opts.label }")
      .Switch__label { opts.label }

  script.
    handleClick() {
      if (this.opts.isdisabled) {
        return;
      }
      this.opts.onchange && this.opts.onchange(!this.opts.isactive);
    }
