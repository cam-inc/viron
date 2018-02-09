import { getComponentStateName } from '../../../store/states';

export default function() {
  this.explorerId = getComponentStateName(this._riot_id);
  this.isInsertButtonDisabled = true;

  let selectedItem = null;
  this.handleExplorerItemSelect = item => {
    this.isInsertButtonDisabled = !item;
    selectedItem = item;
    this.update();
  };

  this.handleInsertButtonTap = () => {
    this.opts.onInsert(selectedItem);
    this.close();
  };

  this.handleCancelButtonTap = () => {
    this.close();
  };
}
