viron-wyswyg-tool-direction.Wyswyg__tool.Wyswyg__direction(class="{ isActive ? 'Wyswyg__tool--active' : '' }")
  .Wyswyg__toolInner(onClick="{ handleInnerClick }")
    svg(if="{ !isActive }" viewbox="0 0 18 18")
      polygon(class="ql-stroke ql-fill" points="3 11 5 9 3 7 3 11")
      line(class="ql-stroke ql-fill" x1="15" x2="11" y1="4" y2="4")
      path(class="ql-fill" d="M11,3a3,3,0,0,0,0,6h1V3H11Z")
      rect(class="ql-fill" height="11" width="1" x="11" y="4")
      rect(class="ql-fill" height="11" width="1" x="13" y="4")
    svg(if="{ isActive }" viewbox="0 0 18 18")
      polygon(class="ql-stroke ql-fill" points="15 12 13 10 15 8 15 12")
      line(class="ql-stroke ql-fill" x1="9" x2="5" y1="4" y2="4")
      path(class="ql-fill" d="M5,3A3,3,0,0,0,5,9H6V3H5Z")
      rect(class="ql-fill" height="11" width="1" x="5" y="4")
      rect(class="ql-fill" height="11" width="1" x="7" y="4")

  script.
    import script from './tool-direction';
    this.external(script);
