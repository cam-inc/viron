import ObjectAssign from 'object-assign';
import riot from 'riot';

// Mouse系かTouch系か。
const isTouchEventSupported = 'ontouchstart' in document;

export default function() {
  const store = this.riotx.get();

  let tag;

  const fadeIn = () => {
    setTimeout(() => {
      this.isVisible = true;
      this.update();
    }, 100);
  };

  const fadeOut = () => {
    this.isVisible = false;
    this.update();
    setTimeout(() => {
      store.action('popovers.remove', this.opts.id);
    }, 1000);
  };

  this.isVisible = false;

  this.on('mount', () => {
    tag = riot.mount(this.refs.content, this.opts.tagname, ObjectAssign({
      isPopover: true,
      popoverCloser: fadeOut
    }, this.opts.tagopts))[0];
    fadeIn();
    window.addEventListener('resize', this.handleWindowResize);
    window.addEventListener('scroll', this.handleWindowScroll);
    window.addEventListener('click', this.handleWindowClick);
    window.addEventListener('touchend', this.handleWindowTouchEnd);
  }).on('before-unmount', () => {
    tag.unmount(true);
  }).on('unmount', () => {
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('scroll', this.handleWindowScroll);
    window.removeEventListener('click', this.handleWindowClick);
    window.removeEventListener('touchend', this.handleWindowTouchend);
  });

  /**
   * 配置座標を返します。
   * @return {String}
   */
  this.getPosition = () => {
    const opts = this.opts.popoveropts;
    const styles = [];
    styles.push(`left:${opts.x}px;`);
    styles.push(`top:${opts.y}px;`);
    return styles.join('');
  };

  /**
   * サイズを返します。
   * @return {String}
   */
  this.getSize = () => {
    const opts = this.opts.popoveropts;
    const styles = [];
    styles.push(`width:${opts.width}px;`);
    // directionが`R`か`L`の時はheight必須。
    if (!!opts.height) {
      styles.push(`height:${opts.height}px;`);
    }
    return styles.join('');
  };

  this.handleFrameInnerTap = e => {
    // 内部イベントを外部に伝播させない。
    e.stopPropagation();
  };

  this.handleFrameInnerScroll = e => {
    // 内部イベントを外部に伝播させない。
    e.stopPropagation();
  };

  this.handleWindowResize = () => {
    fadeOut();
  };

  this.handleWindowScroll = () => {
    fadeOut();
  };

  this.handleWindowClick = () => {
    // mouse環境は扱わない。
    if (isTouchEventSupported) {
      return;
    }
    fadeOut();
  };

  this.handleWindowTouchEnd = () => {
    fadeOut();
  };
}
