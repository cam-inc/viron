viron-application-header-filter-autocomplete.Application_Header_Filter_Autocomplete(onMouseDown="{ handleMouseDown }")
  virtual(if="{ isEmpty }")
    .Application_Header_Filter_Autocomplete__empty 候補無し
  virtual(if="{ !isEmpty }")
    virtual(if="{ !!names.length }")
      .Application_Header_Filter_Autocomplete__list
        .Application_Header_Filter_Autocomplete__label カード
        .Application_Header_Filter_Autocomplete__item(each="{ value in names }" onTap="{ handleItemTap }") { value }
    virtual(if="{ !!_tags.length }")
      .Application_Header_Filter_Autocomplete__list
        .Application_Header_Filter_Autocomplete__label タグ
        .Application_Header_Filter_Autocomplete__item(each="{ value in _tags }" onTap="{ handleItemTap }") { value }

  script.
    import script from './index';
    this.external(script);
