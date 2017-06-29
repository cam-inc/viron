dmc-table-action.Table__action
  dmc-button(each="{ action, idx in opts.actions }" id="{ idx }" label="{ action.value }" onPat="{ parent.handleActionButtonPat }")

  script.
    import script from './action';
    this.external(script);
