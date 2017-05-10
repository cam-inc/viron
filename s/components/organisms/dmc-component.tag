dmc-component.Component(onclick="{ handleClick }")
  .Component__spinner(if="{ isPending }")
    dmc-icon(type="loading")
  virtual(if="{ !isPending }")
    dmc-component-number(if="{ isComponentStyleNumber }" data="{ data }")
    dmc-component-table(if="{ isComponentStyleTable }" data="{ data }" pagination="{ pagination }" componentInfo="{ componentInfo }")
    dmc-component-graph-bar(if="{ isComponentStyleGraphBar }" data="{ data }")

  script.
    import swagger from '../../swagger';
    import constants from '../../core/constants';
    import '../organisms/dmc-component-number.tag';
    import '../organisms/dmc-component-table.tag';
    import '../organisms/dmc-component-graph-bar.tag';
    import '../atoms/dmc-icon.tag';

    const store = this.riotx.get();

    // TODO: dmc-component-fooに渡すやつ
    // TODO: ベターな方法を模索すること。
    this.componentInfo = {
      id: this._riot_id,
      idx: this.opts.idx
    };
    // `pending` means the status of fetching data.
    this.isPending = true;
    // `data` and `pagination` will be filled with detail info after fetching.
    this.data = {};
    this.pagination = {};
    // `component` is kind of a raw data.
    this.component = this.opts.component;
    this.isComponentStyleNumber = swagger.isComponentStyleNumber(this.component.style);
    this.isComponentStyleTable = swagger.isComponentStyleTable(this.component.style);
    this.isComponentStyleGraphBar = swagger.isComponentStyleGraphBar(this.component.style);

    this.on('mount', () => {
      // TODO: debug用なので後でtimeout処理を外すこと。
      setTimeout(() => {
        store.action(constants.ACTION_COMPONENT_GET, this._riot_id, this.opts.idx);
      }, 1000 * 2);
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
      this.update();
    });
