dmc-html.Html
  .Html__tabs
    .Html__tab(class="{ 'Html__tab--selected' : isTabEditorSelected }" ref="touch" onTap="handleTabEditorTap") editor
    .Html__tab(class="{ 'Html__tab--selected' : isTabPreviewSelected }" ref="touch" onTap="handleTabPreviewTap") preview
  .Html__body
    .Html__message(if="{ compileHtml().status === 'failed' }" class="Html__message--{ compileHtml().status }") { compileHtml().message }
    .Html__editor(if="{ isTabEditorSelected }")
      dmc-textarea(text="{ opts.text }" isDisabled="{ opts.isdisabled }" onChange="{ handleEditorChange }")
    .Html__preview(if="{ isTabPreviewSelected }")
      dmc-prettyhtml(data="{ compileHtml().html }")

  script.
    import '../../atoms/dmc-prettyhtml/index.tag';
    import '../../atoms/dmc-textarea/index.tag';
    import script from './index';
    this.external(script);
