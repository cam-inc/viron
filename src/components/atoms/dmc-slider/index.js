export default function() {
  this.isActive = false;
  this.isTooltipShown = false;

  this.handleContainerTouchEvent = e => {
    console.log(e.type);
    if(e.type === 'touchstart') {
      this.isTooltipShown = true;
    }
    if(e.type === 'touchend') {
      this.isTooltipShown = false;
    }
    // 数値範囲外に出てないときだけUpdateする
    const numberRatio = convertActualValue(e);
    if(numberRatio <= this.opts.max && numberRatio >= this.opts.min) {
      this.opts.onchange(numberRatio);
    }
  };

  this.handleContainerMouseEvent = e => {
    console.log(e.type);
    if(e.type === 'mousedown') {
      this.isActive = true;
      this.isTooltipShown = true;
    }
    if(e.type === 'mousemove') {
      if (!this.isActive) {
        return;
      }
    }
    if(e.type === 'mouseup') {
      this.isActive = false;
      this.isTooltipShown = false;
    }
    
    // 数値範囲外に出てないときだけUpdateする
    const numberRatio = convertActualValue(e);
    if(numberRatio <= this.opts.max && numberRatio >= this.opts.min) {
      this.opts.onchange(numberRatio);
    }
  };

  this.handleContainerMouseOver = (e) => {
    console.log(e.type);
    e.stopPropagation();
    this.isTooltipShown = true;
  };

  this.handleContainerMouseOut = (e) => {
    console.log(e.type);
    e.stopPropagation();
    this.isTooltipShown = false;
  };

  this.displayRatio = () => {
    // 現在値がmaxとminより越えている場合、値をmaxかminに修正する
    if (this.opts.number < this.opts.min) {
      return this.opts.min;
    }
    if (this.opts.number > this.opts.max) {
      return this.opts.max;
    }
    return Math.round((this.opts.number - this.opts.min) / (this.opts.max - this.opts.min) * 100);
  };

  const convertActualValue = (e) => {
    const containerRect = document.querySelector('.Slider__container').getBoundingClientRect();
    let touchX = 0;
    if(e.changedTouches) {
      touchX = e.changedTouches[0].pageX;
    } else {
      touchX = e.pageX;
    }
    const distance = Math.round(touchX - containerRect.left);
    const numberRatio = Math.round((distance * (this.opts.max - this.opts.min)) / containerRect.width) - -this.opts.min;
    return numberRatio;
  };
}