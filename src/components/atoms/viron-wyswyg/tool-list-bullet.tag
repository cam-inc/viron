viron-wyswyg-tool-list-bullet.Wyswyg__tool.Wyswyg__listBullet(class="{ isActive ? 'Wyswyg__tool--active' : '' }")
  .Wyswyg__toolInner(onClick="{ handleInnerClick }")
    svg(viewbox="0 0 18 18")
      line(class="ql-stroke" x1="6" x2="15" y1="4" y2="4")
      line(class="ql-stroke" x1="6" x2="15" y1="9" y2="9")
      line(class="ql-stroke" x1="6" x2="15" y1="14" y2="14")
      line(class="ql-stroke" x1="3" x2="3" y1="4" y2="4")
      line(class="ql-stroke" x1="3" x2="3" y1="9" y2="9")
      line(class="ql-stroke" x1="3" x2="3" y1="14" y2="14")

  script.
    import script from './tool-list-bullet';
    this.external(script);
