dmc-component.Component(onclick="{ handleClick }")
  .Component__head
    .Component__name { component.name.get() }
  .Component__body
    .Component__spinner(if="{ isPending }")
      dmc-icon(type="loading")
    dmc-component-number(if="{ !isPending && isComponentStyleNumber }" data="{ data }" pagination="{ pagination }" search="{ search }" updater="{ updater }")
    dmc-component-table(if="{ !isPending && isComponentStyleTable }" data="{ data }" pagination="{ pagination }" search="{ search }" updater="{ updater }")
    dmc-component-graph-bar(if="{ !isPending && isComponentStyleGraphBar }" data="{ data }" pagination="{ pagination }" search="{ search }" updater="{ updater }")
  .Component__tail TODO

  script.
    import swagger from '../../swagger';
    import constants from '../../core/constants';
    import '../organisms/dmc-component-number.tag';
    import '../organisms/dmc-component-table.tag';
    import '../organisms/dmc-component-graph-bar.tag';
    import '../atoms/dmc-icon.tag';

    const store = this.riotx.get();

    // `pending` means the status of fetching data.
    this.isPending = true;
    // `data` and others will be filled with detail info after fetching.
    this.data = {};
    this.pagination = {};
    this.search = null;
    // `component` is kind of a raw data.
    this.component = this.opts.component;
    this.isComponentStyleNumber = swagger.isComponentStyleNumber(this.component.style);
    this.isComponentStyleTable = swagger.isComponentStyleTable(this.component.style);
    this.isComponentStyleGraphBar = swagger.isComponentStyleGraphBar(this.component.style);
    // `updater` will be passed to the child component,(i.e. dmc-component-*) so the child component has the ability to update data.
    this.updater = (query = {}) => {
      this.isPending = true;
      this.update();
      store.action(constants.ACTION_COMPONENT_GET, this._riot_id, this.opts.idx, query);
    };

    this.on('mount', () => {
      // TODO: debug用なので後でtimeout処理を外すこと。
      setTimeout(() => {
        store.action(constants.ACTION_COMPONENT_GET, this._riot_id, this.opts.idx);
      }, 1000);
      //store.action(constants.ACTION_COMPONENT_GET, this._riot_id, this.opts.idx);
    });

    this.on('unmount', () => {
      // TODO: ここに処理が来ない。。why...
      // TODO: state.component内の対象物を削除する？
    });

    handleClick() {
      if (this.isPending) {
        return;
      }

      // TODO: 何かする？
    }

    store.change(constants.changeComponentName(this._riot_id), (err, state, store) => {
      this.isPending = false;
      this.data = state.component[this._riot_id].data;
      this.pagination = state.component[this._riot_id].pagination;
      this.search = state.component[this._riot_id].search;
      this.update();
    });
