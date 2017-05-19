dmc-slider(class="Slider { opts.isdisabled ? 'Slider--disabled' : '' }" onMouseDown="{ handleMouseDown }" onMouseMove="{ handleMouseMove }" onMouseUp="{ handleMouseUp }" onMouseLeave="{ handleMouseLeave }")
  .Slider__groove
  .Slider__bar(style="width: { getPosX() }%;")
  .Slider__knob(style="left: { getPosX() }%;")
    .Slider__ball

  script.
    let isSlidable = false;

    getPosX() {
      const min = this.opts.min;
      const max = this.opts.max;
      const current = this.opts.current;
      return Math.floor(current / (max - min) * 100);
    }

    calculateCurrent(mouseX, rect) {
      const min = this.opts.min;
      const max = this.opts.max;
      const len = max - min;

      return (len * ((mouseX - rect.left) / rect.width)) + min;
    }

    updateCurrent(newCurrent) {
      if (newCurrent < this.opts.min) {
        newCurrent = this.opts.min;
      }
      if (newCurrent > this.opts.max) {
        newCurrent = this.opts.max;
      }
      this.opts.onchange && this.opts.onchange(newCurrent);
    }

    handleMouseDown(e) {
      e.preventUpdate = false;
      if (this.opts.isdisabled) {
        return;
      }
      isSlidable = true;
      const newCurrent = this.calculateCurrent(e.clientX, e.currentTarget.getBoundingClientRect());
      this.updateCurrent(newCurrent);
    }

    handleMouseMove(e) {
      e.preventUpdate = false;
      if (!isSlidable) {
        return;
      }
      const newCurrent = this.calculateCurrent(e.clientX, e.currentTarget.getBoundingClientRect());
      this.updateCurrent(newCurrent);
    }

    handleMouseUp(e) {
      e.preventUpdate = false;
      isSlidable = false;
      const newCurrent = this.calculateCurrent(e.clientX, e.currentTarget.getBoundingClientRect());
      this.updateCurrent(newCurrent);
    }

    handleMouseLeave(e) {
      e.preventUpdate = false;
      isSlidable = false;
    }
