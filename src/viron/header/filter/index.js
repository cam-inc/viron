import '../../../components/viron-error/index.tag';

export default function() {
  const store = this.riotx.get();

  this.isOpened = false;

  this.listen('application', () => {
    if (!this.refs.input) {
      return;
    }
    this.refs.input.value = store.getter('application.endpointFilterText');
  });

  this.handleCloseIconMouseDown = e => {
    // input要素のblurイベント発火を抑制するため。
    e.stopPropagation();
    e.preventDefault();
  };

  this.handleCloseIconTap = () => {
    Promise
      .resolve()
      .then(() => store.action('application.resetEndpointFilterText'))
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };

  this.handleSearchIconMouseDown = e => {
    // input要素のblurイベント発火を抑制するため。
    e.stopPropagation();
    e.preventDefault();
  };

  this.handleSearchIconTap = () => {
    if (this.isOpened) {
      Promise
        .resolve()
        .then(() => store.action('application.updateEndpointFilterText', this.refs.input.value || ''))
        .catch(err => store.action('modals.add', 'viron-error', {
          error: err
        }));
      return;
    }

    this.isOpened = true;
    this.update();
    // formにフォーカスをあてる。
    // DOM生成が完了してからなので、意図的ににsetTimeoutで処理を遅らせる。
    if (this.isOpened) {
      setTimeout(() => {
        if (!this.refs.input) {
          return;
        }
        this.refs.input.value = store.getter('application.endpointFilterText');
        this.refs.input.focus();
      }, 100);
    }
  };

  this.handleFormSubmit = () => {
    Promise
      .resolve()
      .then(() => store.action('application.updateEndpointFilterText', this.refs.input.value || ''))
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };

  this.handleInputBlur = () => {
    this.isOpened = false;
    this.update();
  };

  this.handleInputChange = e => {
    e.stopPropagation();
  };

  this.handleInputInput = () => {
    // TODO: autocomplete
  };
}
