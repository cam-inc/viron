dmc-textarea(class="Textarea { opts.isfocused ? 'Textarea--focused' : '' } { opts.isdisabled ? 'Textarea--disabled' : '' }" click="{ handleClick }")
  form.Textarea__content(ref="form")
    textarea.Textarea__input(value="{ opts.text }" maxlength="{ opts.maxlength }" placeholder="{ opts.placeholder || '' }" disabled="{ opts.isdisabled }" input="{ handleInputChange }" focus="{ handleInputFocus }" blur="{ handleInputBlur }")

  script.
    handleClick() {
      this.refs.form.focus();
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
