export default function() {
  this.email = 'fkei@example.com';
  this.password = '1234567890';

  this.handleEmailChange = newEmail => {
    this.email = newEmail;
    this.update();
  };

  this.handlePasswordChange = newPassword => {
    this.password = newPassword;
    this.update();
  };

  this.handleSigninPat = () => {
    this.opts.onsigninpat(this.email, this.password, this.opts.authtype);
  };
}
