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
    dmc-wyswyg-tool-codeblock(if="{ !!quill }" quill="{ quill }")
  .Wyswyg__editor(ref="editor")

  script.
    import './tool-blockquote.tag';
    import './tool-codeblock.tag';
    import script from './index';
    this.external(script);
