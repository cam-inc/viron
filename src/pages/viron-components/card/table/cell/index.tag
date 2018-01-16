viron-components-page-table-cell.ComponentsPage_Card_Table_Cell
  virtual(if="{ isText }")
    .ComponentsPage_Card_Table_Cell__string(class="{ 'ComponentsPage_Card_Table_Cell__string--emphasised': isEmphasised }") { value }
  virtual(if="{ isImage }")
    virtual(if="{ !isBase64 }")
      .ComponentsPage_Card_Table_Cell__image(style="background-image:url({ value })")
    virtual(if="{ isBase64 }")
      // Data URI Schemeで表示する。
      // @see: https://ja.wikipedia.org/wiki/Data_URI_scheme
      .ComponentsPage_Card_Table_Cell__image(style="background-image:url(data:{ mimeType };base64,{ value })")
  virtual(if="{ isVideo }")
    ComponentsPage_Card_Table_Cell__video TODO
    //video.ComponentsPage_Card_Table_Cell__video(controls)
      //source(src="{ value }" type="video/{ videoType }")
      //div { value }

  script.
    import script from './index';
    this.external(script);
