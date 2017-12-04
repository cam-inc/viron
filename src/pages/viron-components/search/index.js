import util from '../../../components/viron-parameters/util';

export default function() {
  // 入力値。
  // viron-parameterは参照元を弄る。ので予めdeepCloneしておく。
  this.val = util.generateInitialVal(this.opts.parameterObjects, this.opts.initialVal);

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
