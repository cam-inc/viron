viron-pagination.Pagination(class="{ opts.class }")
  .Pagination__control
    virtual(if="{ getIsSimpleMode() }")
      .Pagination__button(class="{ 'Pagination__button--disabled': opts.current === 1 }" onTap="{ handlePrevButtonTap }")
        viron-icon-arrow-left
      .Pagination__button(each="{ page in getBasePages() }" class="{ 'Pagination__button--selected': page.isSelected }" onTap="{ handlePageButtonTap }") { page.num }
      .Pagination__button(class="{ 'Pagination__button--disabled': opts.current === opts.max }" onTap="{ handleNextButtonTap }")
        viron-icon-arrow-right
    virtual(if="{ !getIsSimpleMode() }")
      .Pagination__button(class="{ 'Pagination__button--disabled': opts.current === 1 }" onTap="{ handlePrevButtonTap }")
        viron-icon-arrow-left
      .Pagination__button(if="{ getBasePages()[0].num !== 1 }" onTap="{ handleFirstPageButtonTap }") 1
      .Pagination__button.Pagination__button--moderate(if="{ getBasePages()[0].num >= 3 }" onTap="{ handleRecedeButtonTap }")
        viron-icon-dots(class="Pagination__dotsIcon")
        viron-icon-arrow-left(class="Pagination__arrowIcon")
      .Pagination__button(each="{ page in getBasePages() }" class="{ 'Pagination__button--selected': page.isSelected }" onTap="{ handlePageButtonTap }") { page.num }
      .Pagination__button.Pagination__button--moderate(if="{ getBasePages()[getBasePages().length - 1].num <= opts.max - 2 }" onTap="{ handleProceedButtonTap }")
        viron-icon-dots(class="Pagination__dotsIcon")
        viron-icon-arrow-right(class="Pagination__arrowIcon")
      .Pagination__button(if="{ getBasePages()[getBasePages().length - 1].num !== opts.max }" onTap="{ handleLastPageButtonTap }") { opts.max }
      .Pagination__button(class="{ 'Pagination__button--disabled': opts.current === opts.max }" onTap="{ handleNextButtonTap }")
        viron-icon-arrow-right

  script.
    import '../../components/icons/viron-icon-arrow-left/index.tag';
    import '../../components/icons/viron-icon-arrow-right/index.tag';
    import '../../components/icons/viron-icon-dots/index.tag';
    import script from './index';
    this.external(script);
