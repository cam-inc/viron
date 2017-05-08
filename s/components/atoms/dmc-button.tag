dmc-button(class="Button Button--{ opts.type || 'primary' } { opts.class }" onclick="{ handleClick }")
  span { opts.label }

  script.
    handleClick(e) {
      e.stopPropagation();
      this.opts.onclick && this.opts.onclick();
    }
