import find from 'mout/array/find';
import forEach from 'mout/array/forEach';

export default function() {
  this.queries = this.opts.queries;

  this.handleInputChange = (value, id) => {
    const query = find(this.queries, query => {
      return (query.key === id);
    });
    if (!query) {
      return;
    }
    query.value = value;
    this.update();
  };

  this.handleSearchButtonPat = () => {
    this.close();
    const ret = {};
    forEach(this.queries, query => {
      ret[query.key] = query.value;
    });
    this.opts.onSearch(ret);
  };

  this.handleCancelButtonPat = () => {
    this.close();
  };
}
