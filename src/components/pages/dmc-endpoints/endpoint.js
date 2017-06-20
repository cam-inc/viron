export default function() {
  this.isMenuOpened = false;

  this.handleTap = () => {
    this.opts.onentry(this.opts.key);
  };

  this.handleMenusTap = () => {
    this.isMenuOpened = false;
    this.update();
  };

  this.handleMenuButtonTap = () => {
    this.isMenuOpened = true;
    this.update();
  };

  this.handleEditButtonPat = () => {
    this.opts.onedit(this.opts.key);
  };

  this.handleRemoveButtonPat = () => {
    this.opts.onremove(this.opts.key);
  };

  this.handleLogoutButtonPat = () => {
    this.isMenuOpened = false;
    this.update();
    this.opts.onlogout(this.opts.key);
  };
}
