viron-button.Button(class="Button--{ opts.theme || 'primary' } { opts.isdisabled ? 'Button--disabled' : '' }" onTap="{ handleTap }")
  .Button__label { opts.label }

  script.
    import script from './index';
    this.external(script);
