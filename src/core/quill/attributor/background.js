// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillAttributorClassBackground = Quill.import('attributors/class/background');
const QuillAttributorStyleBackground = Quill.import('attributors/style/background');

export {
  QuillAttributorClassBackground as AttributorClassBackground,
  QuillAttributorStyleBackground as AttributorStyleBackground
};
