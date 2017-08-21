dmc-wyswyg-tool-blockquote.Wyswyg__tool.Wyswyg__blockquote(class="{ isActive ? 'Wyswyg__tool--active' : '' }")
  .Wyswyg__toolInner(ref="touch" onTap="handleInnerTap")
    svg(viewbox="0 0 18 18")
     rect(class="ql-fill ql-stroke" height="3" width="3" x="4" y="5")
     rect(class="ql-fill ql-stroke" height="3" width="3" x="11" y="5")
     path(class="ql-even ql-fill ql-stroke" d="M7,8c0,4.031-3,5-3,5")
     path(class="ql-even ql-fill ql-stroke" d="M14,8c0,4.031-3,5-3,5")

  script.
    import script from './tool-blockquote';
    this.external(script);
