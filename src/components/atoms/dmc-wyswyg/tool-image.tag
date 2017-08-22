dmc-wyswyg-tool-image.Wyswyg__tool.Wyswyg__image(class="{ isActive ? 'Wyswyg__tool--active' : '' }")
  .Wyswyg__toolInner(ref="touch" onTap="handleInnerTap")
    svg(viewbox="0 0 18 18")
      rect(class="ql-stroke" height="10" width="12" x="3" y="4")
      circle(class="ql-fill" cx="6" cy="7" r="1")
      polyline(class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12")

  script.
    import script from './tool-image';
    this.external(script);
