dmc-button(class="Button Button--{ opts.type || 'primary' } { opts.class } { opts.isdisabled ? 'Button--disabled' : ''}" ref="touch" onTap="handleTap")
  span { opts.label }

  script.
    import script from './index';
    this.external(script);
