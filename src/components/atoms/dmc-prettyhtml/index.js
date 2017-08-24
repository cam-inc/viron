import beautifier from 'js-beautify';

const htmlBeautifier = beautifier.html;

export default function() {
  this.getBeautifiedHtml = () => {
    return htmlBeautifier(this.opts.data);
  };
}
