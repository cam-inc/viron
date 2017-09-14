viron-pug.Pug
  .Pug__tabs
    .Pug__tab(class="{ 'Pug__tab--selected' : isTabEditorSelected }" ref="touch" onTap="handleTabEditorTap") editor
    .Pug__tab(class="{ 'Pug__tab--selected' : isTabPreviewSelected }" ref="touch" onTap="handleTabPreviewTap") preview
  .Pug__body
    .Pug__message(if="{ compilePug().status === 'failed' }" class="Pug__message--{ compilePug().status }") { compilePug().message }
    .Pug__editor(if="{ isTabEditorSelected }")
      viron-textarea(text="{ opts.text }" isDisabled="{ opts.isdisabled }" onChange="{ handleEditorChange }")
    .Pug__preview(if="{ isTabPreviewSelected }")
      viron-prettyhtml(data="{ compilePug().html }")

  script.
    import '../../atoms/viron-prettyhtml/index.tag';
    import '../../atoms/viron-textarea/index.tag';
    import script from './index';
    this.external(script);
