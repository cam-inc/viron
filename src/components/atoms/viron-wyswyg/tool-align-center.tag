viron-wyswyg-tool-align-center.Wyswyg__tool.Wyswyg__alignCenter(class="{ isActive ? 'Wyswyg__tool--active' : '' }")
  .Wyswyg__toolInner(onClick="{ handleInnerClick }")
    svg(viewbox="0 0 18 18")
      line(class="ql-stroke" x1="15" x2="3" y1="9" y2="9")
      line(class="ql-stroke" x1="14" x2="4" y1="14" y2="14")
      line(class="ql-stroke" x1="12" x2="6" y1="4" y2="4")

  script.
    import script from './tool-align-center';
    this.external(script);
