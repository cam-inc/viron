dmc-slider(class="Slider { opts.isdisabled ? 'Slider--disabled' : '' }" mousedown="{ handleMouseDown }" mousemove="{ handleMouseMove }" mouseup="{ handleMouseUp }" mouseleave="{ handleMouseLeave }")
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
      if (this.opts.isdisabled) {
        return;
      }
      isSlidable = true;
      const newCurrent = this.calculateCurrent(e.clientX, e.currentTarget.getBoundingClientRect());
      this.updateCurrent(newCurrent);
    }

    handleMouseMove(e) {
      if (!isSlidable) {
        return;
      }
      const newCurrent = this.calculateCurrent(e.clientX, e.currentTarget.getBoundingClientRect());
      this.updateCurrent(newCurrent);
    }

    handleMouseUp(e) {
      isSlidable = false;
      const newCurrent = this.calculateCurrent(e.clientX, e.currentTarget.getBoundingClientRect());
      this.updateCurrent(newCurrent);
    }

    handleMouseLeave() {
      isSlidable = false;
    }
