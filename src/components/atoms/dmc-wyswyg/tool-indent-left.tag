dmc-wyswyg-tool-indent-left.Wyswyg__tool.Wyswyg__indentLeft
  .Wyswyg__toolInner(ref="touch" onTap="handleInnerTap")
    svg(viewbox="0 0 18 18")
      line(class="ql-stroke" x1="3" x2="15" y1="14" y2="14")
      line(class="ql-stroke" x1="3" x2="15" y1="4" y2="4")
      line(class="ql-stroke" x1="9" x2="15" y1="9" y2="9")
      polyline(class="ql-stroke" points="5 7 5 11 3 9 5 7")

  script.
    import script from './tool-indent-left';
    this.external(script);
