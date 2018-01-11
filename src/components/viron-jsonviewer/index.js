export default function() {

  const createJsonViewer = () => {
    const tagTemplates = {
      item: '<div class="Jsonviewer__item"><div class="Jsonviewer__key">%KEY%</div><div class="Jsonviewer__value Jsonviewer__%TYPE%">%VALUE%</div></div>',
      itemClose: '<label class="Jsonviewer__item Jsonviewer__collapsible"><input type="checkbox" class="Jsonviewer__toggle"/><div class="Jsonviewer__key">%KEY%</div><div class="Jsonviewer__value Jsonviewer__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>',
      itemOepn: '<label class="Jsonviewer__item Jsonviewer__collapsible"><input type="checkbox" checked class="Jsonviewer__toggle"/><div class="Jsonviewer__key">%KEY%</div><div class="Jsonviewer__value Jsonviewer__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>'
    };
    const json = this.opts.json;
    const isOpenItem = !!this.opts.isOpen || false;

    const createItem = (key, value, type) => {
      let elem = tagTemplates.item.replace('%KEY%', key);
      elem = elem.replace('%TYPE%', type);
      elem = type === 'string'
        ? elem.replace('%VALUE%', '"' + value + '"')
        : elem.replace('%VALUE%', value);
      return elem;
    };

    const createCollapsibleItem = (key, value, type, children) => {
      const tpl = isOpenItem ? 'itemOepn' : 'itemClose';
      let elem = tagTemplates[tpl].replace('%KEY%', key);
      elem = elem.replace('%VALUE%', type);
      elem = elem.replace('%TYPE%', type);
      elem = elem.replace('%CHILDREN%', children);
      return elem;
    };

    const handleChildren = (key, value, type) => {
      let children = '';
      for (const item in value) {
        const key = item;
        const _value = value[key];
        children += handleItem(key, _value);
      }
      return createCollapsibleItem(key, value, type, children);
    };

    const handleItem = (key, value) => {
      const type = typeof value;
      const hasChildren = value && typeof value === 'object';
      if (hasChildren) {
        return handleChildren(key, value, type);
      }
      return createItem(key, value, type);
    };

    const createTags = json => {
      let tags = '<div class="Jsonviewer">';
      for (const item in json) {
        const key = item;
        const value = json[key];
        tags += handleItem(key, value);
      }
      tags += '</div>';
      return tags;
    };

    return createTags(json);
  };

  this.on('mount', () => {
    this.refs.target.innerHTML = createJsonViewer();
  });
}
