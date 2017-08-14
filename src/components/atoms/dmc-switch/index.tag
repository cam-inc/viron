dmc-switch(class="Switch { opts.ischecked ? 'Switch--active' : '' } { opts.isdisabled ? 'Switch--disabled' : '' }")
  .Switch__label(if="{ !!opts.label }") { opts.label }
  .Switch__groove(onTap="handleKnobPat" ref="touch")
    .Switch__knob
    virtual(if="{ !!opts.uncheckedchar && !!opts.checkedchar }")
      .Switch__inner { opts.ischecked ? opts.checkedchar : opts.uncheckedchar }
  
  script.
    import script from './index.js';
    this.external(script);
