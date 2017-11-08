viron-wyswyg-tool-indent-right.Wyswyg__tool.Wyswyg__indentRight
  .Wyswyg__toolInner(onClick="handleInnerClick")
    svg(viewbox="0 0 18 18")
      line(class="ql-stroke" x1="3" x2="15" y1="14" y2="14")
      line(class="ql-stroke" x1="3" x2="15" y1="4" y2="4")
      line(class="ql-stroke" x1="9" x2="15" y1="9" y2="9")
      polyline(class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7")

  script.
    import script from './tool-indent-right';
    this.external(script);
