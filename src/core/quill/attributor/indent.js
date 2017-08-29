// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillAttributorClassIndent = Quill.import('formats/indent');
// 何故か`attributes`配下に存在しない。。
//const QuillAttributorClassIndent = Quill.import('attributors/class/indent');

const AttributorClassIndent = QuillAttributorClassIndent;

export {
  AttributorClassIndent
};
