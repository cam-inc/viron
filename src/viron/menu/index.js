export default function() {
  const store = this.riotx.get();

  this.closer = () => {
    this.close();
  };

  this.menu = store.getter('viron.menu');
  this.listen('viron', () => {
    this.menu = store.getter('viron.menu');
    this.update();
  });

  this.handleLogoTap = () => {
    this.close();
    this.getRouter().navigateTo('/');
  };
}
