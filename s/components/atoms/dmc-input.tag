dmc-input(class="Input { opts.isfocused ? 'Input--focused' : '' } { opts.isdisabled ? 'Input--disabled' : '' }" onClick="{ handleClick }")
  form.Input__content(ref="form" onSubmit="{ handleFormSubmit }")
    .Input__icon(if="{ !!opts.icon }")
      dmc-icon(type="{ opts.icon }")
    input.Input__input(type="{ opts.type || 'text' }" value="{ opts.text }" placeholder="{ opts.placeholder || '' }" disabled="{ opts.isdisabled }" pattern="{ opts.pattern }" onInput="{ handleInputChange }" onFocus="{ handleInputFocus }" onBlur="{ handleInputBlur }")
    .Input__resetButton(if="{ opts.isresetable }" onClick="{ handleResetButtonClick }")
      dmc-icon(type="close")

  script.
    import '../atoms/dmc-icon.tag';

    const initialText = opts.text || '';

    handleClick(e) {
      e.preventUpdate = false;
      this.refs.form.focus();
    }

    handleFormSubmit(e) {
      e.preventUpdate = false;
      e.preventDefault();
      this.opts.onenter && this.opts.onenter(this.opts.text, this.opts.id);
    }

    handleInputChange(e) {
      e.preventUpdate = false;
      e.stopPropagation();
      const newText = e.target.value.replace(/　/g, ' ');
      this.opts.ontextchange && this.opts.ontextchange(newText, this.opts.id);
    }

    handleInputFocus(e) {
      e.preventUpdate = false;
      this.opts.onfocustoggle && this.opts.onfocustoggle(true, this.opts.id);
    }

    handleInputBlur(e) {
      e.preventUpdate = false;
      this.opts.onfocustoggle && this.opts.onfocustoggle(false, this.opts.id);
    }

    handleResetButtonClick(e) {
      e.preventUpdate = false;
      e.stopPropagation();
      this.opts.onreset && this.opts.onreset(initialText, this.opts.id);
    }
