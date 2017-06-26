import currencyFormat from 'mout/number/currencyFormat';

export default function() {
  this.value = currencyFormat(this.opts.data.getValue('value').getValue(), 0);
}
