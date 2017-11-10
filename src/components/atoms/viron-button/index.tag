viron-button_(class="Button Button--{ opts.type || 'primary' } { opts.class } { opts.isdisabled ? 'Button--disabled' : ''}" onClick="{ handleClick }")
  .Button__content
    .Button__icon(if="{ !!opts.icon }")
      viron-icon(type="{ opts.icon }")
    .Button__label { opts.label }

  script.
    import '../../atoms/viron-icon/index.tag';
    import script from './index';
    this.external(script);
