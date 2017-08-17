export default function() {
  // ホバーのイベントハンドラーの点滅表示を回避するため、
  // mouseoutされて100ms以内にmouseoverが発火されなかったら
  // ホバーを無効にするようにしました。
  // 良くないコードなため、他の案があれば修正求む。
  let timerid;
  this.isActive = false;
  this.isTooltipShown = false;
  this.isHover = false;

  this.handleContainerTouchStart = e => {
    this.isTooltipShown = true;
    const containerRect = this.refs.container.getBoundingClientRect();
    const actualValue = convertActualValue(e.changedTouches[0].pageX, containerRect);
    if (validActualValue(actualValue)) {
      this.opts.onchange(actualValue);
    }
  };

  this.handleContainerTouchMove = e => {
    const containerRect = this.refs.container.getBoundingClientRect();
    const actualValue = convertActualValue(e.changedTouches[0].pageX, containerRect);
    if (validActualValue(actualValue)) {
      this.opts.onchange(actualValue);
    }
  };

  this.handleContainerTouchEnd = e => {
    this.isTooltipShown = false;
    const containerRect = this.refs.container.getBoundingClientRect();
    const actualValue = convertActualValue(e.changedTouches[0].pageX, containerRect);
    if (validActualValue(actualValue)) {
      this.opts.onchange(actualValue);
    }
  };

  this.handleContainerMouseDown = e => {
    this.isActive = true;
    this.isTooltipShown = true;
    const containerRect = this.refs.container.getBoundingClientRect();
    const actualValue = convertActualValue(e.pageX, containerRect);
    if (validActualValue(actualValue)) {
      this.opts.onchange(actualValue);
    }
  };

  this.handleContainerMouseMove = e => {
    if (!this.isActive) {
      return;
    }
    const containerRect = this.refs.container.getBoundingClientRect();
    const actualValue = convertActualValue(e.pageX, containerRect);
    if (validActualValue(actualValue)) {
      this.opts.onchange(actualValue);
    }
  };

  this.handleContainerMouseUp = e => {
    this.isActive = false;
    this.isTooltipShown = false;
    const containerRect = this.refs.container.getBoundingClientRect();
    const actualValue = convertActualValue(e.pageX, containerRect);
    if (validActualValue(actualValue)) {
      this.opts.onchange(actualValue);
    }
  };

  this.handleContainerMouseOver = () => {
    clearTimeout(timerid);
    this.isTooltipShown = true;
    this.isHover = true;
  };

  this.handleContainerMouseOut = () => {
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

  const validActualValue = actualValue => {
    return (actualValue <= this.opts.max && actualValue >= this.opts.min) ? true : false;
  };

  const convertActualValue = (touchX, containerRect) => {
    const distance = Math.round(touchX - containerRect.left);
    const actualValue = Math.round((distance * (this.opts.max - this.opts.min)) / containerRect.width) - -this.opts.min;
    return actualValue;
  };
}