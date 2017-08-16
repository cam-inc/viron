export default function() {
  // ホバーのイベントハンドラーの点滅表示を回避するため、
  // mouseoutされて100ms以内にmouseoverが発火されなかったら
  // ホバーを無効にするようにしました。
  // 良くないコードなため、他の案があれば修正求む。
  let timerid;
  this.isActive = false;
  this.isTooltipShown = false;
  this.isHover = false;

  this.handleContainerTouchEvent = e => {
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
    clearTimeout(timerid);
    this.isTooltipShown = true;
    this.isHover = true;
  };

  this.handleContainerMouseOut = (e) => {
    timerid = setTimeout(() => {
      this.isTooltipShown = false;
      this.isHover = false;
      this.update();
    }, 100);
    
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