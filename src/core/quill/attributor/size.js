// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillAttributorClassSize = Quill.import('attributors/class/size');
const QuillAttributorStyleSize = Quill.import('attributors/style/size');

export {
  QuillAttributorClassSize as AttributorClassSize,
  QuillAttributorStyleSize as AttributorStyleSize
};
