dmc-wyswyg-tool-codeblock.Wyswyg__tool.Wyswyg__codeblock(class="{ isActive ? 'Wyswyg__tool--active' : '' }")
  .Wyswyg__toolInner(ref="touch" onTap="handleInnerTap")
    svg( viewbox="0 0 18 18")
      polyline(class="ql-even ql-stroke" points="5 7 3 9 5 11")
      polyline(class="ql-even ql-stroke" points="13 7 15 9 13 11")
      line(class="ql-stroke" x1="10" x2="8" y1="5" y2="13")

  script.
    import script from './tool-codeblock';
    this.external(script);
