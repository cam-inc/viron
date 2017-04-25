dmc-component
  .dmc-component
    | dmc-component

    dmc-component-number(each="{ ifNumber }" data="{ parent.data }" index="{ parent.index }")
    dmc-component-table(each="{ ifTable }" data="{ parent.data }" index="{ parent.index }")


  script.
    import constants from '../../core/constants';
    import swagger from '../../swagger';
    this.data = this.opts.data;
    this.index = this.opts.index;

    this.ifNumber = swagger.isComponentStyleNumber(this.data.style) ? [true] : [];
    this.ifTable = swagger.isComponentStyleTable(this.data.style) ? [true] : [];

    const store = this.riotx.get();
    store.action(constants.ACTION_COMPONENT_GET, this._riot_id, this.index);
