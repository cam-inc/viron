export default function() {
  // タイプ。
  this.type = this.opts.type || 'info';
  // iconの種類。
  this.icon = '';
  switch (this.opts.type) {
  case 'info':
    this.icon = 'info';
    break;
  case 'error':
    this.icon = 'exclamation';
    break;
  default:
    this.icon = 'info';
    break;
  }

  // タイトル。
  this.title = this.opts.title;
  // メッセージ。
  this.message = this.opts.message;

  // errorが渡された場合は最適化処理を行う。
  if (!!this.opts.error) {
    this.type = 'error';
    this.icon = 'exclamation';
    if (this.opts.error instanceof Error) {
      this.title = this.opts.error.name;
      this.message = this.opts.error.message;
    } else {
      // TODO: どーしようかな。。
      this.title = `${this.opts.error.code} ${this.opts.error.name}`;
      this.message = `[${this.opts.error.id}] ${this.opts.error.message}`;
    }
  }
}
