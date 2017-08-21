// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotCodeBlock = Quill.import('formats/code-block');

class BlotCodeBlock extends QuillBlotCodeBlock {
}

export default BlotCodeBlock;
