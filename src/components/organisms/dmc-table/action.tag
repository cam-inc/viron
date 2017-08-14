dmc-table-action.Table__action
  .Table__actionItem(each="{ action, idx in opts.actions }")
    .Table__actionInner
      .Table__actionTitle { action.value }
      .Table__actionDescription { action.description }
    .Table__actionExecuteButton(idx="{ idx }" ref="touch" onTap="parent.handleActionButtonPat") execute

  script.
    import script from './action';
    this.external(script);
