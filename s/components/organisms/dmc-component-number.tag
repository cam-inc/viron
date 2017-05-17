dmc-component-number.ComponentNumber
  .ComponentNumber__value { value }

  script.
    import { currencyFormat } from 'mout/number';
    this.value = currencyFormat(opts._data.getValue('value').getValue(), 0);
