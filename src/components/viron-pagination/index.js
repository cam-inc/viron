import times from 'mout/function/times';

export default function() {
  this.getIsSimpleMode = () => {
    return (this.opts.max <= this.opts.size);
  };

  this.getBasePages = () => {
    const size = this.opts.size;
    const current = this.opts.current;
    const max = this.opts.max;

    if (this.getIsSimpleMode()) {
      const ret = [];
      times(max, i => {
        i = i + 1;
        ret.push({
          num: i,
          isSelected: (i === current)
        });
      });
      return ret;
    }

    let startPage = current - Math.floor(size / 2);
    let endPage = current + Math.floor(size / 2) - ((size % 2) ? 0 : 1);
    if (startPage < 1) {
      endPage = endPage + Math.abs(startPage + 1);
      startPage = 1;
    }
    if (endPage > max) {
      startPage = startPage - (endPage - max);
      endPage = max;
    }
    const ret = [];
    for (let i = startPage; i <= endPage; i++) {
      ret.push({
        num: i,
        isSelected: (i === current)
      });
    }
    return ret;
  };

  this.handlePrevButtonTap = () => {
    if (!this.opts.onchange) {
      return;
    }
    if (this.opts.current === 1) {
      return;
    }
    let newPage = this.opts.current - 1;
    if (newPage < 1) {
      newPage = 1;
    }
    this.opts.onchange(newPage);
  };

  this.handleFirstPageButtonTap = () => {
    if (!this.opts.onchange) {
      return;
    }
    this.opts.onchange(1);
  };

  this.handleRecedeButtonTap = () => {
    if (!this.opts.onchange) {
      return;
    }
    let newPage = this.opts.current - this.opts.size;
    if (newPage < 1) {
      newPage = 1;
    }
    this.opts.onchange(newPage);
  };

  this.handlePageButtonTap = e => {
    if (!this.opts.onchange) {
      return;
    }
    const newPage = e.item.page.num;
    this.opts.onchange(newPage);
  };

  this.handleProceedButtonTap = () => {
    if (!this.opts.onchange) {
      return;
    }
    let newPage = this.opts.current + this.opts.size;
    if (newPage > this.opts.max) {
      newPage = this.opts.max;
    }
    this.opts.onchange(newPage);
  };

  this.handleLastPageButtonTap = () => {
    if (!this.opts.onchange) {
      return;
    }
    this.opts.onchange(this.opts.max);
  };

  this.handleNextButtonTap = () => {
    if (!this.opts.onchange) {
      return;
    }
    if (this.opts.current === this.opts.max) {
      return;
    }
    let newPage = this.opts.current + 1;
    if (newPage > this.opts.max) {
      newPage = this.opts.max;
    }
    this.opts.onchange(newPage);
  };
}
