dmc-component.Component
  .Component__head
    .Component__name { component.name.get() }
    .Component__search(if="{ !!search }" onClick="{ handleSearchButtonClick }")
      dmc-icon(type="search")
  .Component__body
    .Component__spinner(if="{ isPending }")
      dmc-icon(type="loading")
    div(data-is="{ childComponentName }" if="{ !isPending }" data="{ data }" updater="{ updater }")
    dmc-pagination(if="{ !isPending && !!pagination }" currentPage="{ pagination.currentPage }" maxPage="{ pagination.maxPage }" size="{ 5 }" onChange="{ handlePaginationChange }")
  .Component__tail(if="{ actions }")
    dmc-component-action(each="{ action in actions }" action="{ action }")

  script.
    import { forEach } from 'mout/array';
    import swagger from '../../swagger';
    import constants from '../../core/constants';
    import '../organisms/dmc-component-graph-bar.tag';
    import '../organisms/dmc-component-number.tag';
    import '../organisms/dmc-component-table.tag';
    import '../organisms/dmc-pagination.tag';

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
    this.actions = null;
    // used to render riot component.
    this.childComponentName = null;
    if (swagger.isComponentStyleNumber(this.component.style)) {
      this.childComponentName = 'dmc-component-number';
    } else if (swagger.isComponentStyleTable(this.component.style)) {
      this.childComponentName = 'dmc-component-table';
    } else if (swagger.isComponentStyleGraphBar(this.component.style)) {
      this.childComponentName = 'dmc-component-graph-bar';
    }
    // `updater` will be passed to the child component,(i.e. dmc-component-*) so the child component has the ability to update data.
    this.updater = (query = {}) => {
      this.isPending = true;
      this.update();
      store.action(constants.ACTION_COMPONENT_GET, this._riot_id, this.opts.idx, query);
    };

    this.on('mount', () => {
      // TODO: debug用なので後でtimeout処理を外すこと。
      setTimeout(() => {
        this.updater();
      }, 1000);
      //store.action(constants.ACTION_COMPONENT_GET, this._riot_id, this.opts.idx);
    });

    this.on('unmount', () => {
      // TODO: ここに処理が来ない。。why...
      // TODO: state.component内の対象物を削除する？
    });

    store.change(constants.changeComponentName(this._riot_id), (err, state, store) => {
      this.isPending = false;
      this.data = state.component[this._riot_id].data;
      this.pagination = state.component[this._riot_id].pagination;
      this.search = state.component[this._riot_id].search;
      this.actions = state.component[this._riot_id].actions;
      this.update();
    });

    handleSearchButtonClick() {
      if (this.isPending) {
        return;
      }

      const queries = [];
      forEach(this.search, query => {
        queries.push({
          key: query.key.get(),
          type: query.type.get()
        });
      });
      store.action(constants.ACTION_MODAL_SHOW, 'dmc-component-searchbox', {
        queries,
        onSearch: queries => {
          this.updater(queries);
        }
      });
    }

    handlePaginationChange(page) {
      this.updater({
        limit: this.pagination.size,
        offset: (page - 1) * this.pagination.size
      });
    }

dmc-component-searchbox.Component__searchBox
  .Component__searchBoxInputs
    .Component__searchBoxInput(each="{ query in queries }")
      .Component__searchBoxInputLabel { query.key }
      dmc-input(id="{ query.key }" text="{ query.value }" placeholder="{ query.type }" onTextChange="{ parent.handleInputChange }")
  .Component__searchBoxControls
    dmc-button(label="search" onClick="{ handleSearchButtonClick }")
    dmc-button(label="cancel" type="secondary" onClick="{ handleCancelButtonClick }")

  script.
    import { find } from 'mout/array';
    import '../atoms/dmc-button.tag';

    this.queries = this.opts.queries;

    closeModal() {
      if (this.opts.isModal) {
        this.opts.modalCloser();
      }
    }

    handleInputChange(value, id) {
      const query = find(this.queries, query => {
        return (query.key === id);
      });
      if (!query) {
        return;
      }
      query.value = value;
      this.update();
    }

    handleSearchButtonClick() {
      this.closeModal();
      const ret = {};
      forEach(this.queries, query => {
        ret[query.key] = query.value;
      });
      this.opts.onSearch(ret);
    }

    handleCancelButtonClick() {
      this.closeModal();
    }

dmc-component-action.Component__action
  dmc-button(label="{ opts.action }" onClick="{ handleButtonClick }")

  script.
    import '../atoms/dmc-button.tag';

    handleButtonClick() {
      alert(this.opts.action);
    }
