viron-wyswyg-explorer.Wyswyg_Explorer
  .Wyswyg_Explorer__container
    viron-explorer(id="{ explorerId }" def="{ opts.def }" onInsert="{ handleExplorerInsert }")

  script.
    import '../../../components/viron-explorer/index.tag';
    import script from './index';
    this.external(script);
