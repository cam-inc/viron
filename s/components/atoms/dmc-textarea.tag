dmc-textarea(class="Textarea { opts.isfocused ? 'Textarea--focused' : '' } { opts.isdisabled ? 'Textarea--disabled' : '' }" click="{ handleClick }")
  form.Textarea__content
    textarea.Textarea__input(ref="input" value="{ opts.text }" placeholder="{ opts.placeholder || '' }" disabled="{ opts.isdisabled }" input="{ handleInputChange }" focus="{ handleInputFocus }" blur="{ handleInputBlur }")

  script.
    handleClick() {
      this.refs.input.focus();
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
