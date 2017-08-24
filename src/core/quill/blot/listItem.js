// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotListItem = Quill.import('formats/list/item');

class BlotListItem extends QuillBlotListItem {
}

export default BlotListItem;
