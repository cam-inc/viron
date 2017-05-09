dmc-component-number.ComponentNumber
  .ComponentNumber__head
    .ComponentNumber__name { name }
  .ComponentNumber__body
    .ComponentNumber__value { value }

  script.
    // TODO: name値を取得すること
    this.name = 'Name Name';
    this.value = this.opts.data.value.get();
