viron-components-page-table-cell.ComponentsPage_Card_Table_Cell
  virtual(if="{ isText }")
    .ComponentsPage_Card_Table_Cell__string(onTap="{ handleStringTap }") { value }
  virtual(if="{ isImage }")
    .ComponentsPage_Card_Table_Cell__image(style="background-image:url({ value })")
  virtual(if="{ isVideo }")
    ComponentsPage_Card_Table_Cell__video TODO
    //video.ComponentsPage_Card_Table_Cell__video(controls)
      //source(src="{ value }" type="video/{ videoType }")
      //div { value }

  script.
    import script from './index';
    this.external(script);
