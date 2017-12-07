import util from '../../../components/viron-parameters/util';

export default function() {
  const store = this.riotx.get();

  this.layoutType = store.getter('layout.type');
  // 入力値。
  // viron-parameterは参照元を弄る。ので予めdeepCloneしておく。
  this.val = util.generateInitialVal(this.opts.parameterObjects, this.opts.initialVal);

  this.listen('layout', () => {
    this.layoutType = store.getter('layout.type');
    this.update();
  });

  this.handleCloseButtonTap = () => {
    this.close();
  };

  this.handleParametersChange = newValue => {
    this.val = newValue;
    this.update();
  };

  this.handleSearchButtonTap = () => {
    if (!this.opts.onSearch) {
      this.close();
      return;
    }
    this.opts.onSearch(this.val);
    this.close();
  };
}
