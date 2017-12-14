viron-pug.Pug(class="{ 'Pug--disabled': opts.isdisabled, 'Pug--error': opts.haserror }")
  .Pug__tabs
    .Pug__tab(class="{ 'Pug__tab--selected': isEditorMode }" onTap="{ handleEditorTabTap }") エディタ
    .Pug__tab(class="{ 'Pug__tab--selected': isPreviewMode }" onTap="{ handlePreviewTabTap }") プレビュー
  .Pug__body
    .Pug__editor(if="{ isEditorMode }")
      viron-textarea(val="{ opts.val }" isDisabled="{ opts.isdisabled }" onChange="{ handleEditorChange }" onFocus="{ handleEditorFocus }" onBlur="{ handleEditorBlur }")
    .Pug__preview(if="{ isPreviewMode }")
      viron-prettyhtml(data="{ opts.val }")
  .Pug__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import '../../components/viron-prettyhtml/index.tag';
    import '../../components/viron-textarea/index.tag';
    import script from './index';
    this.external(script);
