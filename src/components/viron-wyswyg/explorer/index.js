import { getComponentStateName } from '../../../store/states';

export default function() {
  this.explorerId = getComponentStateName(this._riot_id);
}
