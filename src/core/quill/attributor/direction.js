// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillAttributorClassDirection = Quill.import('attributors/class/direction');
const QuillAttributorStyleDirection = Quill.import('attributors/style/direction');

// デフォルトでstyle属性を使用する。
Quill.register(QuillAttributorStyleDirection, true);

export {
  QuillAttributorClassDirection as AttributorClassDirection,
  QuillAttributorStyleDirection as AttributorStyleDirection
};
