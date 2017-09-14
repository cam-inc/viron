viron-button(class="Button Button--{ opts.type || 'primary' } { opts.class } { opts.isdisabled ? 'Button--disabled' : ''}" ref="touch" onTap="handleTap")
  .Button__content
    .Button__icon(if="{ !!opts.icon }")
      viron-icon(type="{ opts.icon }")
    .Button__label { opts.label }

  script.
    import '../../atoms/viron-icon/index.tag';
    import script from './index';
    this.external(script);
