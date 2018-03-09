viron-wyswyg-explorer.Wyswyg_Explorer
  .Wyswyg_Explorer__head
    .Wyswyg_Explorer__back(onTap="{ handleBackTap }")
      viron-icon-arrow-left
    .Wyswyg_Explorer__title 画像アップロード
  .Wyswyg_Explorer__body
    viron-explorer(id="{ explorerId }" def="{ opts.def }" onInsert="{ handleExplorerInsert }")

  script.
    import '../../../components/icons/viron-icon-arrow-left/index.tag';
    import '../../../components/viron-explorer/index.tag';
    import script from './index';
    this.external(script);
