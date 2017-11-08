viron-wyswyg-tool-align-left.Wyswyg__tool.Wyswyg__alignLeft(class="{ isActive ? 'Wyswyg__tool--active' : '' }")
  .Wyswyg__toolInner(onClick="{ handleInnerClick }")
    svg(viewbox="0 0 18 18")
      line(class="ql-stroke" x1="3" x2="15" y1="9" y2="9")
      line(class="ql-stroke" x1="3" x2="13" y1="14" y2="14")
      line(class="ql-stroke" x1="3" x2="9" y1="4" y2="4")

  script.
    import script from './tool-align-left';
    this.external(script);
