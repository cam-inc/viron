// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillAttributorClassSize = Quill.import('attributors/class/size');
const QuillAttributorStyleSize = Quill.import('attributors/style/size');

// デフォルトでstyle属性を使用する。
Quill.register(QuillAttributorStyleSize, true);

export {
  QuillAttributorClassSize as AttributorClassSize,
  QuillAttributorStyleSize as AttributorStyleSize
};
