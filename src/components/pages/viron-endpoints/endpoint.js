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
  });

  this.handleClick = () => {
    this.opts.onentry(this.opts.key);
  };

  this.handleEditButtonClick = () => {
    this.opts.onedit(this.opts.key);
  };

  this.handleRemoveButtonClick = () => {
    this.opts.onremove(this.opts.key);
  };

  this.handleLogoutButtonClick = () => {
    this.opts.onlogout(this.opts.key);
  };

  this.handleQrCodeButtonClick = () => {
    this.opts.onqrcode(this.opts.key);
  };
}
