import prettifier from 'pretty';

export default function() {
  this.getBeautifiedHtml = () => {
    const data = this.opts.data;
    if (!data) {
      return '';
    }
    return prettifier(data);
  };
}
