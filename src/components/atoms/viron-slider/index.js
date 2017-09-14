export default function() {
  // ホバーのイベントハンドラーの点滅表示を回避するため、
  // mouseoutされて100ms以内にmouseoverが発火されなかったら
  // ホバーを無効にするようにしました。
  // 良くないコードなため、他の案があれば修正求む。
  let timerid;
  // スライダーのキャッチャーをアクティブするかどうか
  this.isActive = false;
  // ツールチップを表示するかどうか
  this.isTooltipShown = false;
  // スライダーをホバーしたかどうか
  this.isHover = false;

  this.on('before-unmount', () => {
    clearTimeout(timerid);
  });

  this.handleContainerTouchStart = e => {
    this.isTooltipShown = true;
    if (this.opts.isdisabled) {
      return;
    }
    const actualValue = convertToActualValue(e.changedTouches[0].pageX);
    if (validActualValue(actualValue)) {
      this.opts.onchange(actualValue);
    }
  };

  this.handleContainerTouchMove = e => {
    if (this.opts.isdisabled) {
      return;
    }
    const actualValue = convertToActualValue(e.changedTouches[0].pageX);
    if (validActualValue(actualValue)) {
      this.opts.onchange(actualValue);
    }
  };

  this.handleContainerTouchEnd = e => {
    this.isTooltipShown = false;
    if (this.opts.isdisabled) {
      return;
    }
    const actualValue = convertToActualValue(e.changedTouches[0].pageX);
    if (validActualValue(actualValue)) {
      this.opts.onchange(actualValue);
    }
  };

  this.handleContainerMouseDown = e => {
    if (this.opts.isdisabled) {
      return;
    }
    this.isActive = true;
    this.isTooltipShown = true;
    const actualValue = convertToActualValue(e.pageX);
    if (validActualValue(actualValue)) {
      this.opts.onchange(actualValue);
    }
  };

  this.handleCatcherMouseMove = e => {
    if (this.opts.isdisabled) {
      return;
    }
    if (!this.isActive) {
      return;
    }
    const actualValue = convertToActualValue(e.pageX);
    if (validActualValue(actualValue)) {
      this.opts.onchange(actualValue);
    }
  };

  this.handleCatcherMouseUp = e => {
    if (this.opts.isdisabled) {
      return;
    }
    this.isActive = false;
    this.isTooltipShown = (this.isHover) ? true : false;
    const actualValue = convertToActualValue(e.pageX);
    if (validActualValue(actualValue)) {
      this.opts.onchange(actualValue);
    }
  };

  this.handleContainerMouseOver = () => {
    clearTimeout(timerid);
    this.isTooltipShown = true;
    if (this.opts.isdisabled) {
      return;
    }
    this.isHover = true;
  };

  this.handleContainerMouseOut = () => {
    timerid = setTimeout(() => {
      this.isTooltipShown = false;
      this.isHover = false;
      this.update();
    }, 100);
  };

  this.displayActualValue = () => {
    // 現在値がmaxとminより越えている場合、値をmaxかminに修正する
    if (Number(this.opts.number) < Number(this.opts.min)) {
      return Number(this.opts.min);
    }
    if (Number(this.opts.number) > Number(this.opts.max)) {
      return Number(this.opts.max);
    }
    return Math.round((Number(this.opts.number) - Number(this.opts.min)) / (Number(this.opts.max) - Number(this.opts.min)) * 100);
  };

  const validActualValue = actualValue => {
    return (actualValue <= Number(this.opts.max) && actualValue >= Number(this.opts.min)) ? true : false;
  };

  const convertToActualValue = touchX => {
    const containerRect = this.refs.container.getBoundingClientRect();
    const distance = Math.round(touchX - containerRect.left);
    const actualValue = Math.round((distance * (Number(this.opts.max) - Number(this.opts.min))) / containerRect.width) - (-Number(this.opts.min));
    return actualValue;
  };
}