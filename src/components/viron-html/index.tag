viron-html.Html(class="{ 'Html--disabled': opts.isdisabled, 'Html--error': opts.haserror }")
  .Html__tabs
    .Html__tab(class="{ 'Html__tab--selected': isEditorMode }" onTap="{ handleEditorTabTap }") { i18n('compornents_viron_html_copy_edit') }
    .Html__tab(class="{ 'Html__tab--selected': isPreviewMode }" onTap="{ handlePreviewTabTap }") { i18n('compornents_viron_html_copy_preview') }
  .Html__body
    .Html__editor(if="{ isEditorMode }")
      viron-textarea(val="{ opts.val }" isDisabled="{ opts.isdisabled }" onChange="{ handleEditorChange }" onFocus="{ handleEditorFocus }" onBlur="{ handleEditorBlur }")
    .Html__preview(if="{ isPreviewMode }")
      viron-prettyhtml(data="{ opts.val }")
  .Html__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import '../../components/viron-prettyhtml/index.tag';
    import '../../components/viron-textarea/index.tag';
    import script from './index';
    this.external(script);
