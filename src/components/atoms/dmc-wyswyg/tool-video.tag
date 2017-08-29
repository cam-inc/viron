dmc-wyswyg-tool-video.Wyswyg__tool.Wyswyg__video(class="{ isActive ? 'Wyswyg__tool--active' : '' }")
  .Wyswyg__toolInner(ref="touch" onTap="handleInnerTap")
    svg(viewbox="0 0 18 18")
      rect(class="ql-stroke" height="12" width="12" x="3" y="3")
      rect(class="ql-fill" height="12" width="1" x="5" y="3")
      rect(class="ql-fill" height="12" width="1" x="12" y="3")
      rect(class="ql-fill" height="2" width="8" x="5" y="8")
      rect(class="ql-fill" height="1" width="3" x="3" y="5")
      rect(class="ql-fill" height="1" width="3" x="3" y="7")
      rect(class="ql-fill" height="1" width="3" x="3" y="10")
      rect(class="ql-fill" height="1" width="3" x="3" y="12")
      rect(class="ql-fill" height="1" width="3" x="12" y="5")
      rect(class="ql-fill" height="1" width="3" x="12" y="7")
      rect(class="ql-fill" height="1" width="3" x="12" y="10")
      rect(class="ql-fill" height="1" width="3" x="12" y="12")

  script.
    import script from './tool-video';
    this.external(script);
