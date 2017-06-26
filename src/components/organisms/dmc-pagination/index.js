export default function() {
  this.getBasePages = () => {
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
        isSelected: (i === this.opts.currentpage)
      });
    }
    return ret;
  };

  this.handlePrevButtonTap = () => {
    let newPage = this.opts.currentpage - 1;
    if (newPage < 1) {
      newPage = 1;
    }
    this.opts.onchange(newPage);
  };

  this.handleRecedeButtonTap = () => {
    let newPage = this.opts.currentpage - this.opts.size;
    if (newPage < 1) {
      newPage = 1;
    }
    this.opts.onchange(newPage);
  };

  this.handlePageButtonTap = e => {
    const newPage = Number(e.currentTarget.getAttribute('data-page'));
    this.opts.onchange(newPage);
  };

  this.handleProceedButtonTap = () => {
    let newPage = this.opts.currentpage + this.opts.size;
    if (newPage > this.opts.maxpage) {
      newPage = this.opts.maxpage;
    }
    this.opts.onchange(newPage);
  };

  this.handleNextButtonTap = () => {
    let newPage = this.opts.currentpage + 1;
    if (newPage > this.opts.maxpage) {
      newPage = this.opts.maxpage;
    }
    this.opts.onchange(newPage);
  };
}
