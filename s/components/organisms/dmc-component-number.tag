dmc-component-number.ComponentNumber
  .ComponentNumber__head
    .ComponentNumber__name { name }
    .ComponentNumber__description(if="{ !!description }") { description }
  .ComponentNumber__body
    .ComponentNumber__value { value }

  script.
    // TODO: name値を取得すること
    this.name = 'Name Name';
    // TODO: opts.dataの構成を詳しく調べること。
    this.description = this.opts.data.value && this.opts.data.value.definition.description;
    this.value = this.opts.data.value.get();
