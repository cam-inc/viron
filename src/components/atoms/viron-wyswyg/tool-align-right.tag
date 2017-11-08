viron-wyswyg-tool-align-right.Wyswyg__tool.Wyswyg__alignRight(class="{ isActive ? 'Wyswyg__tool--active' : '' }")
  .Wyswyg__toolInner(onClick="{ handleInnerClick }")
    svg(viewbox="0 0 18 18")
      line(class="ql-stroke" x1="15" x2="3" y1="9" y2="9")
      line(class="ql-stroke" x1="15" x2="5" y1="14" y2="14")
      line(class="ql-stroke" x1="15" x2="9" y1="4" y2="4")

  script.
    import script from './tool-align-right';
    this.external(script);
