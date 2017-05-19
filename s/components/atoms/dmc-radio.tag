dmc-radio(class="Radio { opts.isselected ? 'Radio--selected' : '' } { opts.isdisabled ? 'Radio--disabled' : '' }" onClick="{ handleClick }")
  .Radio__content
    .Radio__mark
      .Radio__ball
    virtual(if="{ !!opts.label }")
      .Radio__label { opts.label }

  script.
    handleClick(e) {
      e.preventUpdate = false;
      if (this.opts.isdisabled) {
        return;
      }
      this.opts.onchange && this.opts.onchange(!this.opts.isselected, this.opts.id);
    }
