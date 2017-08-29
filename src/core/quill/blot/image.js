// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlockEmbed = Quill.import('blots/block/embed');

class BlotImage extends QuillBlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute('src', value);
    return node;
  }

  static value(node) {
    return node.getAttribute('src');
  }
}
BlotImage.blotName = 'image';
BlotImage.tagName = 'img';

Quill.register(BlotImage);

export default BlotImage;
