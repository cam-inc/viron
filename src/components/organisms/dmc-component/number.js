import currencyFormat from 'mout/number/currencyFormat';

export default function() {
  this.value = currencyFormat(this.opts.response.value, 0);
}
