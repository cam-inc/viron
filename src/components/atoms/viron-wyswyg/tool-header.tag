viron-wyswyg-tool-header.Wyswyg__tool.Wyswyg__header(class="{ isActive ? 'Wyswyg__tool--active' : '' }")
  .Wyswyg__toolInner(onClick="{ handleInnerClick }")
    svg(viewbox="0 0 18 18")
      line(class="ql-stroke" x1="3" x2="3" y1="4" y2="14")
      line(class="ql-stroke" x1="11" x2="11" y1="4" y2="14")
      line(class="ql-stroke" x1="11" x2="3" y1="9" y2="9")
    .Wyswyg__headerLevel { opts.level }

  script.
    import script from './tool-header';
    this.external(script);
