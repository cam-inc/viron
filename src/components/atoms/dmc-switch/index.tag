dmc-switch(class="{ opts.ischecked ? 'Switch--active' : '' } { opts.isdisabled ? 'Switch--disabled' : '' }")
  .Switch__label(if="{ !!opts.label }") { opts.label }
  .Switch__container
    .Switch__groove(onTap="handleKnobPat" ref="touch")
      .Switch__knob
      virtual(if="{ !!opts.uncheckedtext.length && !!opts.checkedtext.length }")
        .Switch__inner { opts.ischecked ? opts.checkedtext : opts.uncheckedtext }
    
  script.
    import script from './index.js';
    this.external(script);
