// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillAttributorClassBackground = Quill.import('attributors/class/background');
const QuillAttributorStyleBackground = Quill.import('attributors/style/background');

// デフォルトでstyle属性を使用する。
Quill.register(QuillAttributorStyleBackground, true);

export {
  QuillAttributorClassBackground as AttributorClassBackground,
  QuillAttributorStyleBackground as AttributorStyleBackground
};
