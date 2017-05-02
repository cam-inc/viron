dmc-input(class="Input { opts.isfocused ? 'Input--focused' : '' } { opts.isdisabled ? 'Input--disabled' : '' }" click="{ handleClick }")
  form.Input__content(submit="{ handleFormSubmit }")
    .Input__icon(if="{ !!opts.icon }")
      dmc-icon(type="{ opts.icon }")
    input.Input__input(ref="input" type="{ opts.type || 'text' }" value="{ opts.text }" placeholder="{ opts.placeholder || '' }" disabled="{ opts.isdisabled }" input="{ handleInputChange }" focus="{ handleInputFocus }" blur="{ handleInputBlur }")
    .Input__resetButton(if="{ opts.isresetable }" click="{ handleResetButtonClick }")
      dmc-icon(type="close")

  script.
    import '../atoms/dmc-icon.tag';

    const initialText = opts.text || '';

    handleClick() {
      this.refs.input.focus();
    }

    handleFormSubmit(e) {
      e.preventDefault();
      this.opts.onenter && this.opts.onenter(this.opts.text);
    }

    handleInputChange(e) {
      const newText = e.target.value.replace(/　/g, ' ');
      this.opts.ontextchange && this.opts.ontextchange(newText);
    }

    handleInputFocus() {
      this.opts.onfocustoggle && this.opts.onfocustoggle(true);
    }

    handleInputBlur() {
      this.opts.onfocustoggle && this.opts.onfocustoggle(false);
    }

    handleResetButtonClick(e) {
      e.stopPropagation();
      this.opts.onreset && this.opts.onreset(initialText);
    }
