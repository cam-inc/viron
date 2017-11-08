export default function() {
  this.descriptionsMarkdown = {
    content: this.opts.endpoint.description,
    markedOptions: {}
  };

  this.on('update', () => {
    this.descriptionsMarkdown = {
      content: this.opts.endpoint.description,
      markedOptions: {}
    };
  }).on('updated', () => {
    this.rebindTouchEvents();
  });

  this.handleTap = () => {
    this.opts.onentry(this.opts.key);
  };

  this.handleEditButtonPpat = () => {
    this.opts.onedit(this.opts.key);
  };

  this.handleRemoveButtonPpat = () => {
    this.opts.onremove(this.opts.key);
  };

  this.handleLogoutButtonPpat = () => {
    this.opts.onlogout(this.opts.key);
  };

  this.handleQrCodeButtonPpat = () => {
    this.opts.onqrcode(this.opts.key);
  };
}
