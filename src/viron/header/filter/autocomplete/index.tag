viron-application-header-filter-autocomplete.Application_Header_Filter_Autocomplete(onMouseDown="{ handleMouseDown }")
  virtual(if="{ isEmpty }")
    .Application_Header_Filter_Autocomplete__empty { i18n('header_filter_autocomplete_emprty') }
  virtual(if="{ !isEmpty }")
    virtual(if="{ !!names.length }")
      .Application_Header_Filter_Autocomplete__list
        .Application_Header_Filter_Autocomplete__label { i18n('header_filter_autocomplete_card') }
        .Application_Header_Filter_Autocomplete__item(each="{ value in names }" onTap="{ handleItemTap }") { value }
    virtual(if="{ !!_tags.length }")
      .Application_Header_Filter_Autocomplete__list
        .Application_Header_Filter_Autocomplete__label { i18n('header_filter_autocomplete_tag') }
        .Application_Header_Filter_Autocomplete__item(each="{ value in _tags }" onTap="{ handleItemTap }") { value }

  script.
    import script from './index';
    this.external(script);
