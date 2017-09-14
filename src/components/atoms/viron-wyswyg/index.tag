viron-wyswyg.Wyswyg(class="{ 'Wyswyg--bubbled' : isBubbled, 'Wyswyg--disabled' : opts.isdisabled }")
  .Wyswyg__toolbar
    viron-wyswyg-tool-image(if="{ !!quill }" quill="{ quill }")
    viron-wyswyg-tool-video(if="{ !!quill }" quill="{ quill }")
    viron-wyswyg-tool-header(if="{ !!quill }" quill="{ quill }" level="{ 1 }")
    viron-wyswyg-tool-header(if="{ !!quill }" quill="{ quill }" level="{ 2 }")
    viron-wyswyg-tool-header(if="{ !!quill }" quill="{ quill }" level="{ 3 }")
    viron-wyswyg-tool-header(if="{ !!quill }" quill="{ quill }" level="{ 4 }")
    viron-wyswyg-tool-header(if="{ !!quill }" quill="{ quill }" level="{ 5 }")
    viron-wyswyg-tool-header(if="{ !!quill }" quill="{ quill }" level="{ 6 }")
    viron-wyswyg-tool-list-ordered(if="{ !!quill }" quill="{ quill }")
    viron-wyswyg-tool-list-bullet(if="{ !!quill }" quill="{ quill }")
    viron-wyswyg-tool-indent-left(if="{ !!quill }" quill="{ quill }")
    viron-wyswyg-tool-indent-right(if="{ !!quill }" quill="{ quill }")
    viron-wyswyg-tool-align-left(if="{ !!quill }" quill="{ quill }")
    viron-wyswyg-tool-align-center(if="{ !!quill }" quill="{ quill }")
    viron-wyswyg-tool-align-right(if="{ !!quill }" quill="{ quill }")
    viron-wyswyg-tool-direction(if="{ !!quill }" quill="{ quill }")
    viron-wyswyg-tool-blockquote(if="{ !!quill }" quill="{ quill }")
    viron-wyswyg-tool-codeblock(if="{ !!quill }" quill="{ quill }")
  .Wyswyg__editor(ref="editor")

  script.
    import './tool-align-center.tag';
    import './tool-align-left.tag';
    import './tool-align-right.tag';
    import './tool-blockquote.tag';
    import './tool-codeblock.tag';
    import './tool-direction.tag';
    import './tool-header.tag';
    import './tool-image.tag';
    import './tool-indent-left.tag';
    import './tool-indent-right.tag';
    import './tool-list-bullet.tag';
    import './tool-list-ordered.tag';
    import './tool-video.tag';
    import script from './index';
    this.external(script);
