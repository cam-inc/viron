import util from '../../../components/viron-parameters/util';
import '../card/table/operations/index.tag';

export default function() {
  const store = this.riotx.get();
  const dataList = this.opts.dataList;
  const initialSelectedIdx = this.opts.selectedIdx;

  this.layoutType = store.getter('layout.type');
  this.parameterObjects = this.opts.parameterObjects;
  this.operations = this.opts.operations || [];
  this.val = null;
  this.selectedIdx = null;
  this.isPrevButtonDisabled = false;
  this.isNextButtonDisabled = false;

  /**
   * 指定idxのrowデータに切り替えます。
   * @param {Number} idx
   */
  const changeData = idx => {
    this.val = util.generateInitialVal(this.parameterObjects, dataList[idx]);
    this.selectedIdx = idx;
    this.isPrevButtonDisabled = (idx === 0);
    this.isNextButtonDisabled = (idx === (dataList.length - 1));
  };
  changeData(initialSelectedIdx);

  this.listen('layout', () => {
    this.layoutType = store.getter('layout.type');
    this.update();
  });

  this.handleOperationsButtonTap = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    store.action('popovers.add', 'viron-components-page-table-operations', {
      operations: this.operations,
      onSelect: operationObject => {
        this.opts.onOperationSelect(operationObject, this.selectedIdx);
        this.close();
      }
    }, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      width: 240,
      direction: 'TR'
    });
  };

  this.handleBackButtonTap = () => {
    this.close();
  };

  this.handlePrevButtonTap = () => {
    if (this.isPrevButtonDisabled) {
      return;
    }
    changeData(this.selectedIdx - 1);
    this.update();
  };

  this.handleNextButtonTap = () => {
    if (this.isNextButtonDisabled) {
      return;
    }
    changeData(this.selectedIdx + 1);
    this.update();
  };
}
