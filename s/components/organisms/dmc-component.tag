dmc-component.Component
  .Component__head
    .Component__name { opts.component.name.get() }
    .Component__search(if="{ !!search }" onClick="{ handleSearchButtonClick }")
      dmc-icon(type="search")
  .Component__body
    .Component__spinner(if="{ isPending }")
      dmc-icon(type="loading")
    div(data-is="{ childComponentName }" if="{ !isPending && isValidData }" data="{ data }" _data="{ _data }" actions="{ childActions }" updater="{ updater }")
    .Component__alert(if="{ !isPending && !isValidData }")
      .Component__alertApi { alertApi }
      .Component__alertText { alertText }
    dmc-pagination(if="{ !isPending && !!pagination }" currentPage="{ pagination.currentPage }" maxPage="{ pagination.maxPage }" size="{ 5 }" onChange="{ handlePaginationChange }")
  .Component__tail(if="{ !!selfActions }")
    dmc-component-action(each="{ action in selfActions }" action="{ action }" updater="{ parent.updater }")

  script.
    import { forEach } from 'mout/array';
    import swagger from '../../swagger';
    import constants from '../../core/constants';
    import '../organisms/dmc-component-graph-bar.tag';
    import '../organisms/dmc-component-graph-horizontal-bar.tag';
    import '../organisms/dmc-component-graph-horizontal-stacked-bar.tag';
    import '../organisms/dmc-component-graph-line.tag';
    import '../organisms/dmc-component-graph-scatterplot.tag';
    import '../organisms/dmc-component-graph-stacked-area.tag';
    import '../organisms/dmc-component-graph-stacked-bar.tag';
    import '../organisms/dmc-component-number.tag';
    import '../organisms/dmc-component-table.tag';
    import '../organisms/dmc-pagination.tag';
    import '../atoms/dmc-icon.tag';

    const store = this.riotx.get();

    // `pending` means the status of fetching data.
    this.isPending = true;
    // whether the response is valid or not.
    this.isValidData = false;
    // alert info if not valid.
    this.alertApi = '';
    this.alertText = '';
    // `data` and others will be filled with detail info after fetching.
    this.data = null;
    this._data = null;
    this.pagination = null;
    this.search = null;
    this.selfActions = null;
    this.childActions = null;
    // used to render riot component.
    this.childComponentName = null;
    if (swagger.isComponentStyleNumber(this.opts.component.style)) {
      this.childComponentName = 'dmc-component-number';
    } else if (swagger.isComponentStyleTable(this.opts.component.style)) {
      this.childComponentName = 'dmc-component-table';
    } else if (swagger.isComponentStyleGraphBar(this.opts.component.style)) {
      this.childComponentName = 'dmc-component-graph-bar';
    } else if (swagger.isComponentStyleGraphScatterplot(this.opts.component.style)) {
      this.childComponentName = 'dmc-component-graph-scatterplot';
    } else if (swagger.isComponentStyleGraphLine(this.opts.component.style)) {
      this.childComponentName = 'dmc-component-graph-line';
    } else if (swagger.isComponentStyleGraphHorizontalBar(this.opts.component.style)) {
      this.childComponentName = 'dmc-component-graph-horizontal-bar';
    } else if (swagger.isComponentStyleGraphStackedBar(this.opts.component.style)) {
      this.childComponentName = 'dmc-component-graph-stacked-bar';
    } else if (swagger.isComponentStyleGraphHorizontalStackedBar(this.opts.component.style)) {
      this.childComponentName = 'dmc-component-graph-horizontal-stacked-bar';
    } else if (swagger.isComponentStyleGraphStackedArea(this.opts.component.style)) {
      this.childComponentName = 'dmc-component-graph-stacked-area';
    }
    // `updater` will be passed to the child component,(i.e. dmc-component-*) so the child component has the ability to update data.
    this.updater = (query = {}) => {
      this.isPending = true;
      this.update();
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_COMPONENTS_GET, this._riot_id, this.opts.component, query))
        .catch(err => store.action(constants.ACTION_TOAST_SHOW, {
          message: err.message
        }));
    };

    validateResponse(data) {
      const type = data.getType();
      const method = this.opts.component.api.method.get();
      const path = this.opts.component.api.path.get();
      const style = this.opts.component.style.get();

      if (swagger.isComponentStyleNumber(this.opts.component.style)) {
      if (type !== 'object' || data.getValue('value') === undefined) {
          this.isValidData = false;
          this.alertApi = `${method}: ${path}`;
          this.alertText = `response of component styled "${style}" should be form of "object" and have "value" key.`;
          return;
        }
      }

      if (swagger.isComponentStyleTable(this.opts.component.style)) {
        if (type !== 'array') {
          this.isValidData = false;
          this.alertApi = `${method}: ${path}`;
          this.alertText = `response of component styled "${style}" should be form of "array".`;
          return;
        }
        if (!data.getLength() || data.getValue(0).getType() !== 'object') {
          this.isValidData = false;
          this.alertApi = `${method}: ${path}`;
          this.alertText = `response of component styled "${style}" should be composed with "object".`;
          return;
        }
      }

      // TODO: 全タイプ
      if (swagger.isComponentStyleGraphBar(this.opts.component.style)) {
        if (type !== 'object') {
          this.isValidData = false;
          this.alertApi = `${method}: ${path}`;
          this.alertText = `response of component styled "${style}" should be form of "object".`;
          return;
        }
        if (!data.getValue('keys') || !data.getValue('data') || data.getValue('keys').getType() !== 'array' || data.getValue('data').getType() !== 'array') {
          this.isValidData = false;
          this.alertApi = `${method}: ${path}`;
          this.alertText = `response of component styled "${style}" should be composed with "keys" and "data". value sholud be an "array".`;
          return;
        }
        if (!data.getValue('data').getLength() || data.getValue('keys').getLength() !== data.getValue('data').getValue(0).getLength()) {
          this.isValidData = false;
          this.alertApi = `${method}: ${path}`;
          this.alertText = `response of component styled "${style}" should be composed with "keys" and "data". "keys" and "data[idx]" should have same length.`;
          return;
        }
      }

      this.isValidData = true;
      this.alertText = '';
    }

    this.on('mount', () => {
      // TODO: debug用なので後でtimeout処理を外すこと。
      setTimeout(() => {
        this.updater();
      }, 1000);
    });

    store.change(constants.changeComponentsName(this._riot_id), (err, state, store) => {
      this.isPending = false;
      const component = store.getter(constants.GETTER_COMPONENTS_ONE, this._riot_id);
      this.data = component.data;
      this._data = component._data;
      if (component.pagination && component.pagination.maxPage > 1) {
        this.pagination = component.pagination;
      } else {
        this.pagination = null;
      }
      this.search = component.search;
      this.selfActions = component.selfActions;
      this.childActions = component.childActions;
      this.validateResponse(this._data);
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
  dmc-button(label="{ opts.action.operationId }" onClick="{ handleButtonClick }")

  script.
    import '../organisms/dmc-operation.tag';
    import '../atoms/dmc-button.tag';

    const store = this.riotx.get();

    handleButtonClick() {
      store.action(constants.ACTION_MODAL_SHOW, 'dmc-operation', {
        operation: this.opts.action,
        onSuccess: () => {
          this.opts.updater();
        }
      });
    }
