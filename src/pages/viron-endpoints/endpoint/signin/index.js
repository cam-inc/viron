import filter from 'mout/array/filter';
import constants from '../../../../core/constants';
import { constants as getters } from '../../../../store/getters';
import { constants as states } from '../../../../store/states';

export default function() {
  const store = this.riotx.get();

  this.isDesktop = store.getter(getters.LAYOUT_IS_DESKTOP);
  this.emails = filter(this.opts.authtypes, authtype => {
    return (authtype.type === constants.authtypeEmail);
  });
  this.oauths = filter(this.opts.authtypes, authtype => {
    return (authtype.type === constants.authtypeOauth);
  });

  this.listen(states.LAYOUT, () => {
    this.isDesktop = store.getter(getters.LAYOUT_IS_DESKTOP);
    this.update();
  });

  // 子コンポーネントに渡す。モーダルを閉じるため。
  this.closer = () => {
    this.close();
  };
}
