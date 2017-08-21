dmc-wyswyg.Wyswyg
  .Wyswyg__toolbar
    dmc-wyswyg-tool-image
    dmc-wyswyg-tool-video
    dmc-wyswyg-tool-header
    dmc-wyswyg-tool-list
    dmc-wyswyg-tool-indent
    dmc-wyswyg-tool-align
    dmc-wyswyg-tool-direction
    dmc-wyswyg-tool-blockquote(if="{ !!quill }" quill="{ quill }")
    dmc-wyswyg-tool-codeblock
  .Wyswyg__editor(ref="editor")
    blockquote  testes
    div bbbbbbb
      b bbbbb
      | bbb
    div
      div VV
        b V
        | VV
    div tesssteste
    div
      i italic
      b bold
      span.Wyswyg__italic spanitalic

  script.
    import './tool-blockquote.tag';
    import script from './index';
    this.external(script);
