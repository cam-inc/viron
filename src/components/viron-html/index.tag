viron-html.Html(class="{ 'Html--disabled': opts.isdisabled, 'Html--error': opts.haserror }")
  .Html__tabs
    .Html__tab(class="{ 'Html__tab--selected': isEditorMode }" onTap="{ handleEditorTabTap }") エディタ
    .Html__tab(class="{ 'Html__tab--selected': isPreviewMode }" onTap="{ handlePreviewTabTap }") プレビュー
  .Html__body
    .Html__editor(if="{ isEditorMode }")
      viron-textarea(val="{ opts.val }" isDisabled="{ opts.isdisabled }" onChange="{ handleEditorChange }")
    .Html__preview(if="{ isPreviewMode }")
      viron-prettyhtml(data="{ opts.val }")

  script.
    import '../../components/viron-prettyhtml/index.tag';
    import '../../components/viron-textarea/index.tag';
    import script from './index';
    this.external(script);
