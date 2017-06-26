import forEach from 'mout/array/forEach';
import forOwn from 'mout/object/forOwn';
import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';

export default function() {
  const store = this.riotx.get();

  const group = items => {
    const groups = {};
    let counter = 0;
    forEach(items, (item, idx) => {
      const assignment = item.group || `independent_${idx}`;
      if (!groups[assignment]) {
        groups[assignment] = {
          name: assignment,
          index: counter,
          list: [],
          isIndependent: !item.group
        };
        counter = counter + 1;
      }
      groups[assignment].list.push(item);
    });

    const ret = [];
    forOwn(groups, val => {
      const index = val.index;
      delete val.index;
      ret[index] = val;
    });

    return ret;
  };

  const current = store.getter(getters.CURRENT);
  this.endpoint = store.getter(getters.ENDPOINTS_ONE, current);
  const dashboard = store.getter(getters.DMC_DASHBOARD);
  const manage = store.getter(getters.DMC_MANAGE);
  this.groupedDashboard = group(dashboard);
  this.groupedManage = group(manage);

  this.listen(states.ENDPOINTS, () => {
    const current = store.getter(getters.CURRENT);
    this.endpoint = store.getter(getters.ENDPOINTS_ONE, current);
    this.update();
  });
  this.listen(states.DMC, () => {
    const dashboard = store.getter(getters.DMC_DASHBOARD);
    const manage = store.getter(getters.DMC_MANAGE);
    this.groupedDashboard = group(dashboard);
    this.groupedManage = group(manage);
    this.update();
  });

  this.handleCloseButtonTap = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.MENU_CLOSE));
  };
}
