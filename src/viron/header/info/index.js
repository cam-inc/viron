export default function() {
  const store = this.riotx.get();

  // エンドポイント名。
  this.name = store.getter('viron.name');
  // エンドポイントのカラー。
  this.color = store.getter('viron.color');
  const key = store.getter('viron.endpointKey');
  const endpoint = store.getter('endpoints.one', key);
  // エンドポイントのURL。
  this.url = !!endpoint ? endpoint.url : null;
  // エンドポイントの説明。
  this.description = !!endpoint ? endpoint.description : null;
  // エンドポイントのtag群。
  this._tags = !!endpoint ? endpoint.tags : null;

  this.listen('viron', () => {
    this.name = store.getter('viron.name');
    this.color = store.getter('viron.color');
    const key = store.getter('viron.endpointKey');
    const endpoint = store.getter('endpoints.one', key);
    this.url = !!endpoint ? endpoint.url : null;

    this.description = !!endpoint ? endpoint.description : null;

    this._tags = !!endpoint ? endpoint.tags : null;
    this.update();
  });
}
