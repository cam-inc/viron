import forEach from 'mout/array/forEach';
import forOwn from 'mout/object/forOwn';
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

  const current = store.getter('current.all');
  this.endpoint = store.getter('endpoints.one', current);
  const dashboard = store.getter('viron.dashboard');
  const manage = store.getter('viron.manage');
  this.groupedDashboard = group(dashboard);
  this.groupedManage = group(manage);

  this.listen(states.ENDPOINTS, () => {
    const current = store.getter('current.all');
    this.endpoint = store.getter('endpoints.one', current);
    this.update();
  });
  this.listen(states.VIRON, () => {
    const dashboard = store.getter('viron.dashbboard');
    const manage = store.getter('viron.manage');
    this.groupedDashboard = group(dashboard);
    this.groupedManage = group(manage);
    this.update();
  });

  this.handleHomeButtonClick = () => {
    this.getRouter().navigateTo('/');
  };
}
