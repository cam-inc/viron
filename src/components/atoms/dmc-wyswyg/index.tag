dmc-wyswyg.Wyswyg
  .Wyswyg__toolbar
    dmc-wyswyg-tool-image
    dmc-wyswyg-tool-video
    dmc-wyswyg-tool-header(if="{ !!quill }" quill="{ quill }" level="{ 1 }")
    dmc-wyswyg-tool-header(if="{ !!quill }" quill="{ quill }" level="{ 2 }")
    dmc-wyswyg-tool-header(if="{ !!quill }" quill="{ quill }" level="{ 3 }")
    dmc-wyswyg-tool-header(if="{ !!quill }" quill="{ quill }" level="{ 4 }")
    dmc-wyswyg-tool-header(if="{ !!quill }" quill="{ quill }" level="{ 5 }")
    dmc-wyswyg-tool-header(if="{ !!quill }" quill="{ quill }" level="{ 6 }")
    dmc-wyswyg-tool-list-ordered(if="{ !!quill }" quill="{ quill }")
    dmc-wyswyg-tool-list-bullet(if="{ !!quill }" quill="{ quill }")
    dmc-wyswyg-tool-indent-left(if="{ !!quill }" quill="{ quill }")
    dmc-wyswyg-tool-indent-right(if="{ !!quill }" quill="{ quill }")
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
    import './tool-header.tag';
    import './tool-indent-left.tag';
    import './tool-indent-right.tag';
    import './tool-list-bullet.tag';
    import './tool-list-ordered.tag';
    import script from './index';
    this.external(script);
