dmc-textarea(class="Textarea { opts.isfocused ? 'Textarea--focused' : '' } { opts.isdisabled ? 'Textarea--disabled' : '' }" onClick="{ handleClick }")
  form.Textarea__content(ref="form")
    textarea.Textarea__input(value="{ opts.text }" maxlength="{ opts.maxlength }" placeholder="{ opts.placeholder || '' }" disabled="{ opts.isdisabled }" onInput="{ handleInputChange }" onFocus="{ handleInputFocus }" onBlur="{ handleInputBlur }")

  script.
    handleClick(e) {
      e.preventUpdate = false;
      this.refs.form.focus();
    }

    handleInputChange(e) {
      e.preventUpdate = false;
      const newText = e.target.value.replace(/　/g, ' ');
      this.opts.ontextchange && this.opts.ontextchange(newText);
    }

    handleInputFocus(e) {
      e.preventUpdate = false;
      this.opts.onfocustoggle && this.opts.onfocustoggle(true);
    }

    handleInputBlur(e) {
      e.preventUpdate = false;
      this.opts.onfocustoggle && this.opts.onfocustoggle(false);
    }
