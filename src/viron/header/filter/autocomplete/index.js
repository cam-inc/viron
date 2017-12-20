export default function() {
  const store = this.riotx.get();
  const maxSize = 5;

  this.names = store.getter('endpoints.namesFiltered', maxSize);
  // `tag`はriotの予約後なので_を付けとく。
  this._tags = store.getter('endpoints.tagsFiltered', maxSize);
  this.isEmpty = (!this.names.length && !this._tags.length);

  this.listen('application', () => {
    this.names = store.getter('endpoints.namesFiltered', maxSize);
    this._tags = store.getter('endpoints.tagsFiltered', maxSize);
    this.isEmpty = (!this.names.length && !this._tags.length);
    this.update();
  });

  this.handleMouseDown = e => {
    // input要素のblurイベント発火を抑制するため。
    e.stopPropagation();
    e.preventDefault();
  };

  this.handleItemTap = e => {
    const text = e.item.value || '';
    Promise
      .resolve()
      .then(() => store.action('application.updateEndpointFilterText', text))
      .catch(err => store.action('modals.add', 'viron-error', {
        error: err
      }));
  };
}
