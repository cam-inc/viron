viron-application-header-filter.Application_Header_Filter(class="{ 'Application_Header_Filter--opened': isOpened }")
  viron-icon-close.Application_Header_Filter__closeIcon(if="{ isOpened }" onMouseDown="{ handleCloseIconMouseDown }" onTap="{ handleCloseIconTap }")
  form.Application_Header_Filter__form(if="{ isOpened }" onSubmit="{ handleFormSubmit }")
    input.Application_Header_Filter__input(ref="input" placeholder="カードを検索" onFocus="{ handleInputFocus }" onBlur="{ handleInputBlur }" onInput="{ handleInputInput }" onChange="{ handleInputChange }")
  viron-icon-search.Application_Header_Filter__searchIcon(onMouseDown="{ handleSearchIconMouseDown }" onTap="{ handleSearchIconTap }")
  .Application_Header_Filter__text(if="{ !isOpened && !!filterText }") filtered by: { filterText }

  script.
    import '../../../components/icons/viron-icon-close/index.tag';
    import '../../../components/icons/viron-icon-search/index.tag';
    import script from './index';
    this.external(script);
