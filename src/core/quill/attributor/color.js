// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillAttributorClassColor = Quill.import('attributors/class/color');
const QuillAttributorStyleColor = Quill.import('attributors/style/color');

export {
  QuillAttributorClassColor as AttributorClassColor,
  QuillAttributorStyleColor as AttributorStyleColor
};
