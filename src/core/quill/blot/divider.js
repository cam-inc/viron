// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;

const QuillBlotBlockEmbed = Quill.import('blots/block/embed');

class BlotDivider extends QuillBlotBlockEmbed {
}

BlotDivider.blotName = 'myDivider';
BlotDivider.tagName = 'hr';

export default BlotDivider;
