viron-wyswyg-explorer.Wyswyg_Explorer
  .Wyswyg_Explorer__container
    viron-explorer(id="{ explorerId }" def="{ opts.def }" onSelect="{ handleExplorerItemSelect }")
  .Wyswyg_Explorer__tail
    viron-button(label="挿入する" isDisabled="{ isInsertButtonDisabled }" onSelect="{ handleInsertButtonTap }")
    viron-button(label="キャンセル" onSelect="{ handleCancelButtonTap }")

  script.
    import '../../../components/viron-button/index.tag';
    import '../../../components/viron-explorer/index.tag';
    import script from './index';
    this.external(script);
