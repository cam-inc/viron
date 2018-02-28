import { getComponentStateName } from '../../../store/states';

export default function() {
  this.explorerId = getComponentStateName(this._riot_id);

  this.handleBackTap = () => {
    this.close();
  };

  this.handleExplorerInsert = item => {
    this.opts.onInsert(item);
    this.close();
  };
}
