viron-pagination.Pagination(class="{ opts.class }")
  .Pagination__control
    div(class="Pagination__button { opts.currentpage === 1 ? 'Pagination__button--disabled' : '' }" onClick="{ handlePrevButtonClick }")
      viron-icon(type="left")
    div(if="{ getBasePages()[0].num !== 1 }" class="Pagination__button" data-page="1" onClick="{ handlePageButtonClick }") 1
    div(if="{ getBasePages()[0].num >= 3 }" class="Pagination__button Pagination__button--moderate" onClick="{ handleRecedeButtonClick }")
      viron-icon(type="ellipsis" class="Pagination__ellipsisIcon")
      viron-icon(type="doubleLeft" class="Pagination__recedeIcon")
    div(each="{ page in getBasePages() }" class="Pagination__button { page.isSelected ? 'Pagination__button--selected' : '' }" data-page="{ page.num }" onClick="{ parent.handlePageButtonClick }") { page.num }
    div(if="{ getBasePages()[getBasePages().length - 1].num <= opts.maxpage - 2 }" class="Pagination__button Pagination__button--moderate" onClick="{ handleProceedButtonClick }")
      viron-icon(type="ellipsis" class="Pagination__ellipsisIcon")
      viron-icon(type="doubleRight" class="Pagination__proceedIcon")
    div(if="{ getBasePages()[getBasePages().length - 1].num !== opts.maxpage }" class="Pagination__button" data-page="{ opts.maxpage }" onClick="{ handlePageButtonClick }") { opts.maxpage }
    div(class="Pagination__button { opts.currentpage === opts.maxpage ? 'Pagination__button--disabled' : '' }" onClick="{ handleNextButtonClick }")
      viron-icon(type="right")

  script.
    import '../../atoms/viron-icon/index.tag';
    import script from './index';
    this.external(script);
