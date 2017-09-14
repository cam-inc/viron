viron-application-order.Application__order
  .Application__orderTitle 並び順を変更
  .Application__orderDescription ドラッグ&ドロップでエンドポイントの並び順を変更できます。
  .Application__orderPlayground
    viron-application-order-droparea(order="{ 0 }")
    virtual(each="{ endpoint, idx in endpoints }")
      viron-application-order-item(endpoint="{ endpoint }")
      viron-application-order-droparea(order="{ idx + 1 }")

  script.
    import './order-droparea.tag';
    import './order-item.tag';
    import script from './order';
    this.external(script);
