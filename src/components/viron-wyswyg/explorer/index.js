import { getComponentStateName } from '../../../store/states';

export default function() {
  debugger;
  this.explorerId = getComponentStateName(this._riot_id);
}
