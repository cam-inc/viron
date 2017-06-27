import { constants as getters } from '../../../store/getters';

export default function() {
  const store = this.riotx.get();

  this.isOpened = false;

  this.handleToggleTap = () => {
    if (this.opts.group.isIndependent) {
      this.getRouter().navigateTo(`/${store.getter(getters.CURRENT)}/${this.opts.group.list[0].id}`);
    } else {
      this.isOpened = !this.isOpened;
      this.update();
    }
  };

  this.handleGroupItemTap = e => {
    const pageName = this.opts.group.list[Number(e.currentTarget.getAttribute('data-idx'))].id;
    this.getRouter().navigateTo(`/${store.getter(getters.CURRENT)}/${pageName}`);
  };
}
