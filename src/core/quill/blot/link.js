// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotLink = Quill.import('formats/link');

class BlotLink extends QuillBlotLink {
}

export default BlotLink;
