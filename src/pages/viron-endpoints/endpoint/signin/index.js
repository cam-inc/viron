import filter from 'mout/array/filter';
import constants from '../../../../core/constants';

export default function() {
  const store = this.riotx.get();

  this.isDesktop = store.getter('layout.isDesktop');
  this.emails = filter(this.opts.authtypes, authtype => {
    return (authtype.type === constants.authtypeEmail);
  });
  this.oauths = filter(this.opts.authtypes, authtype => {
    return (authtype.type === constants.authtypeOauth);
  });

  this.listen('layout', () => {
    this.isDesktop = store.getter('layout.isDesktop');
    this.update();
  });

  // 子コンポーネントに渡す。モーダルを閉じるため。
  this.closer = () => {
    this.close();
  };
}
