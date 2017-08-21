// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillAttributorClassFont = Quill.import('attributors/class/font');
const QuillAttributorStyleFont = Quill.import('attributors/style/font');

export {
  QuillAttributorClassFont as AttributorClassFont,
  QuillAttributorStyleFont as AttributorStyleFont
};
