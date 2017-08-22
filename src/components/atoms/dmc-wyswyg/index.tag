dmc-wyswyg.Wyswyg
  .Wyswyg__toolbar
    dmc-wyswyg-tool-image
    dmc-wyswyg-tool-video
    dmc-wyswyg-tool-header
    dmc-wyswyg-tool-list
    dmc-wyswyg-tool-indent
    dmc-wyswyg-tool-align-left(if="{ !!quill }" quill="{ quill }")
    dmc-wyswyg-tool-align-center(if="{ !!quill }" quill="{ quill }")
    dmc-wyswyg-tool-align-right(if="{ !!quill }" quill="{ quill }")
    dmc-wyswyg-tool-direction(if="{ !!quill }" quill="{ quill }")
    dmc-wyswyg-tool-blockquote(if="{ !!quill }" quill="{ quill }")
    dmc-wyswyg-tool-codeblock(if="{ !!quill }" quill="{ quill }")
  .Wyswyg__editor(ref="editor")

  script.
    import './tool-align-center.tag';
    import './tool-align-left.tag';
    import './tool-align-right.tag';
    import './tool-blockquote.tag';
    import './tool-codeblock.tag';
    import './tool-direction.tag';
    import script from './index';
    this.external(script);
