export default function() {
  this.email = '';
  this.password = '';

  this.handleEmailChange = newEmail => {
    this.email = newEmail;
    this.update();
  };

  this.handlePasswordChange = newPassword => {
    this.password = newPassword;
    this.update();
  };

  this.handleSigninPpat = () => {
    this.opts.onsigninppat(this.email, this.password, this.opts.authtype);
  };
}
