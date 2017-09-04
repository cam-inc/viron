dmc-pagination.Pagination(class="{ opts.class }")
  .Pagination__control
    div(class="Pagination__button { opts.currentpage === 1 ? 'Pagination__button--disabled' : '' }" ref="touch" onTap="handlePrevButtonTap")
      dmc-icon(type="left")
    div(if="{ getBasePages()[0].num !== 1 }" class="Pagination__button" data-page="1" ref="touch" onTap="handlePageButtonTap") 1
    div(if="{ getBasePages()[0].num >= 3 }" class="Pagination__button Pagination__button--moderate" ref="touch" onTap="handleRecedeButtonTap")
      dmc-icon(type="ellipsis" class="Pagination__ellipsisIcon")
      dmc-icon(type="doubleLeft" class="Pagination__recedeIcon")
    div(each="{ page in getBasePages() }" class="Pagination__button { page.isSelected ? 'Pagination__button--selected' : '' }" data-page="{ page.num }" ref="touch" onTap="parent.handlePageButtonTap") { page.num }
    div(if="{ getBasePages()[getBasePages().length - 1].num <= opts.maxpage - 2 }" class="Pagination__button Pagination__button--moderate" ref="touch" onTap="handleProceedButtonTap")
      dmc-icon(type="ellipsis" class="Pagination__ellipsisIcon")
      dmc-icon(type="doubleRight" class="Pagination__proceedIcon")
    div(if="{ getBasePages()[getBasePages().length - 1].num !== opts.maxpage }" class="Pagination__button" data-page="{ opts.maxpage }" ref="touch" onTap="handlePageButtonTap") { opts.maxpage }
    div(class="Pagination__button { opts.currentpage === opts.maxpage ? 'Pagination__button--disabled' : '' }" ref="touch" onTap="handleNextButtonTap")
      dmc-icon(type="right")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import script from './index';
    this.external(script);
