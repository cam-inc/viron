// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotScript = Quill.import('formats/script');

class BlotScript extends QuillBlotScript {
}

export default BlotScript;
