// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillAttributorClassDirection = Quill.import('attributors/class/direction');
const QuillAttributorStyleDirection = Quill.import('attributors/style/direction');

export {
  QuillAttributorClassDirection as AttributorClassDirection,
  QuillAttributorStyleDirection as AttributorStyleDirection
};
