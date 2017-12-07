export default function() {
  this.list = this.opts.list || [];
  // 最大何件まで表示するか。
  this.size = this.opts.size || this.list.length;
  if (this.size > this.list.length) {
    this.size = this.list.length;
  }
  const itemHeight = 50;
  // body部の高さ。
  this.bodyHeight = itemHeight * this.size;
  // bodyの位置。
  this.bodyTop = 0;

  // 戻るボタンやさらに表示ボタンが必要か？
  this.hasControlButtons = (this.list.length > this.size);
  this.currentIdx = 0;
  this.maxIdx = this.list.length - this.size;

  this.handlePrevItemTap = () => {
    this.currentIdx = this.currentIdx - 1;
    if (this.currentIdx < 0) {
      this.currentIdx = 0;
    }
    this.bodyTop = this.currentIdx * itemHeight;
    this.update();
  };

  this.handleNextItemTap = () => {
    this.currentIdx = this.currentIdx + 1;
    if (this.currentIdx > this.maxIdx) {
      this.currentIdx = this.maxIdx;
    }
    this.bodyTop = this.currentIdx * itemHeight;
    this.update();
  };

  this.handleItemTap = e => {
    if (!this.opts.onselect) {
      return;
    }
    const id = e.item.item.id;
    this.opts.onselect(id);
  };
}
