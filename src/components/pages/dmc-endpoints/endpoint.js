export default function() {
  this.descriptionsMarkdown = {
    content: this.opts.endpoint.description,
    markedOptions: {}
  };

  this.on('updated', () => {
    this.rebindTouchEvents();
  });

  this.handleTap = () => {
    this.opts.onentry(this.opts.key);
  };

  this.handleEditButtonPat = () => {
    this.opts.onedit(this.opts.key);
  };

  this.handleRemoveButtonPat = () => {
    this.opts.onremove(this.opts.key);
  };

  this.handleLogoutButtonPat = () => {
    this.opts.onlogout(this.opts.key);
  };

  this.handleQrCodeButtonPat = () => {
    this.opts.onqrcode(this.opts.key);
  };
}
