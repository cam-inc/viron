export default function() {
  this.isMenuOpened = false;

  this.descriptionsMarkdown = {
    content: this.opts.description,
    markedOptions: {},
  };

  this.on('updated', () => {
    this.rebindTouchEvents();
  });

  this.handleTap = () => {
    this.opts.onentry(this.opts.key);
  };

  this.handleMenusTap = e => {
    if (!e.target.classList.contains('EndpointsPage__itemMenus')) {
      return;
    }
    this.isMenuOpened = false;
    this.update();
  };

  this.handleMenuButtonTap = () => {
    this.isMenuOpened = true;
    this.update();
  };

  this.handleEditButtonPat = () => {
    this.isMenuOpened = false;
    this.update();
    this.opts.onedit(this.opts.key, this.opts.url, this.opts.memo);
  };

  this.handleRemoveButtonPat = () => {
    this.opts.onremove(this.opts.key);
  };

  this.handleLogoutButtonPat = () => {
    this.isMenuOpened = false;
    this.update();
    this.opts.onlogout(this.opts.key);
  };

  this.handleQrCodeButtonPat = () => {
    this.isMenuOpened = false;
    this.update();
    this.opts.onqrcode(this.opts.key, this.opts.url, this.opts.memo);

  }
}
