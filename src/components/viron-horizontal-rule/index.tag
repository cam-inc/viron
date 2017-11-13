viron-horizontal-rule.HorizontalRule
  .HorizontalRule__line
  virtual(if="{ !!opts.label }")
    .HorizontalRule__label { opts.label }
    .HorizontalRule__line

  script.
    import script from './index';
    this.external(script);
