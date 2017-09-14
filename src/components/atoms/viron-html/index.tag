viron-html.Html
  .Html__tabs
    .Html__tab(class="{ 'Html__tab--selected' : isTabEditorSelected }" ref="touch" onTap="handleTabEditorTap") editor
    .Html__tab(class="{ 'Html__tab--selected' : isTabPreviewSelected }" ref="touch" onTap="handleTabPreviewTap") preview
  .Html__body
    .Html__message(if="{ compileHtml().status === 'failed' }" class="Html__message--{ compileHtml().status }") { compileHtml().message }
    .Html__editor(if="{ isTabEditorSelected }")
      viron-textarea(text="{ opts.text }" isDisabled="{ opts.isdisabled }" onChange="{ handleEditorChange }")
    .Html__preview(if="{ isTabPreviewSelected }")
      viron-prettyhtml(data="{ compileHtml().html }")

  script.
    import '../../atoms/viron-prettyhtml/index.tag';
    import '../../atoms/viron-textarea/index.tag';
    import script from './index';
    this.external(script);
