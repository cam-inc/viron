dmc-pagination.Pagination
  .Pagination__control
    div(class="Pagination__button { opts.currentpage === 1 ? 'Pagination__button--disabled' : '' }" onClick="{ handlePrevButtonClick }")
      dmc-icon(type="left")
    div(if="{ getBasePages()[0].num !== 1 }" class="Pagination__button" data-page="1" onClick="{ handlePageButtonClick }") 1
    div(if="{ getBasePages()[0].num >= 3 }" class="Pagination__button Pagination__button--moderate" onClick="{ handleRecedeButtonClick }")
      dmc-icon(type="ellipsis" class="Pagination__ellipsisIcon")
      dmc-icon(type="doubleLeft" class="Pagination__recedeIcon")
    div(each="{ page in getBasePages() }" class="Pagination__button { page.isSelected ? 'Pagination__button--selected' : '' }" data-page="{ page.num }" onClick="{ parent.handlePageButtonClick }") { page.num }
    div(if="{ getBasePages()[getBasePages().length - 1].num <= opts.maxpage - 2 }" class="Pagination__button Pagination__button--moderate" onClick="{ handleProceedButtonClick }")
      dmc-icon(type="ellipsis" class="Pagination__ellipsisIcon")
      dmc-icon(type="doubleRight" class="Pagination__proceedIcon")
    div(if="{ getBasePages()[getBasePages().length - 1].num !== opts.maxpage }" class="Pagination__button" data-page="{ opts.maxpage }" onClick="{ handlePageButtonClick }") { opts.maxpage }
    div(class="Pagination__button { opts.currentpage === opts.maxpage ? 'Pagination__button--disabled' : '' }" onClick="{ handleNextButtonClick }")
      dmc-icon(type="right")
  .Pagination__info { opts.currentpage } / { opts.maxpage }

  script.
    import '../atoms/dmc-icon.tag';

    getBasePages() {
      const size = this.opts.size;
      const currentPage = this.opts.currentpage;
      const maxPage = this.opts.maxpage;
      let startPage = currentPage - Math.floor(size / 2);
      let endPage = currentPage + Math.floor(size / 2) - ((size % 2) ? 0 : 1);
      if (startPage < 1) {
        endPage = endPage + Math.abs(startPage + 1);
        startPage = 1;
      }
      if (endPage > maxPage) {
        startPage = startPage - (endPage - maxPage);
        endPage = maxPage;
      }

      const ret = [];
      for (let i = startPage; i <= endPage; i++) {
        ret.push({
          num: i,
          isSelected: (i === opts.currentpage)
        });
      }
      return ret;
    }

    handlePrevButtonClick(e) {
      e.preventUpdate = false;
      let newPage = this.opts.currentpage - 1;
      if (newPage < 1) {
        newPage = 1;
      }
      this.opts.onchange(newPage);
    }

    handleRecedeButtonClick(e) {
      e.preventUpdate = false;
      let newPage = this.opts.currentpage - this.opts.size;
      if (newPage < 1) {
        newPage = 1;
      }
      this.opts.onchange(newPage);
    }

    handlePageButtonClick(e) {
      e.preventUpdate = false;
      const newPage = Number(e.currentTarget.getAttribute('data-page'));
      this.opts.onchange(newPage);
    }

    handleProceedButtonClick(e) {
      e.preventUpdate = false;
      let newPage = this.opts.currentpage + this.opts.size;
      if (newPage > this.opts.maxpage) {
        newPage = this.opts.maxpage;
      }
      this.opts.onchange(newPage);
    }

    handleNextButtonClick(e) {
      e.preventUpdate = false;
      let newPage = this.opts.currentpage + 1;
      if (newPage > this.opts.maxpage) {
        newPage = this.opts.maxpage;
      }
      this.opts.onchange(newPage);
    }
