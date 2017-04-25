dmc-component
  .dmc-component
    | dmc-component

    dmc-component-number(each="{ ifNumber }" component="{  parent.component}" data="{ parent.data }" index="{ parent.index }")
    dmc-component-table(each="{ ifTable }" data="{ parent.data }" index="{ parent.index }")

  script.
    import constants from '../../core/constants';
    import swagger from '../../swagger';
    this.data = {};
    this.component = this.opts.data;
    this.index = this.opts.index;

    this.ifNumber = swagger.isComponentStyleNumber(this.component.style) ? [true] : [];
    this.ifTable = swagger.isComponentStyleTable(this.component.style) ? [true] : [];

    const store = this.riotx.get();

    store.change(constants.changeComponentName(this._riot_id), (err, state, store) => {
      this.data = state.component[this._riot_id];
      debugger;
      this.update();
    });

    store.action(constants.ACTION_COMPONENT_GET, this._riot_id, this.index);
