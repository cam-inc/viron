viron-button.Button(class="Button--{ opts.theme || 'primary' } { 'Button--disabled' : opts.isdisabled } { opts.class }" onTap="{ handleTap }")
  .Button__label { opts.label }

  script.
    import script from './index';
    this.external(script);
