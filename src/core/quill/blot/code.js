// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotCode = Quill.import('formats/code');

class BlotCode extends QuillBlotCode {
}

export default BlotCode;
