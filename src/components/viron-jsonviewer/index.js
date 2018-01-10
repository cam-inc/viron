export default function() {

  const updateJsonViewer = (collapsible=false) => {
    const json = this.opts.json;
    const TAG_TEMPLATES = {
      item: '<div class="Jsonviewer__item"><div class="Jsonviewer__key">%KEY%</div><div class="Jsonviewer__value Jsonviewer__value--%TYPE%">%VALUE%</div></div>',
      itemCollapsible: '<label class="Jsonviewer__item Jsonviewer__item--collapsible"><input type="checkbox" class="Jsonviewer__toggle"/><div class="Jsonviewer__key">%KEY%</div><div class="Jsonviewer__value Jsonviewer__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>',
      itemCollapsibleOpen: '<label class="Jsonviewer__item Jsonviewer__item--collapsible"><input type="checkbox" checked class="Jsonviewer__toggle"/><div class="Jsonviewer__key">%KEY%</div><div class="Jsonviewer__value Jsonviewer__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>'
    };

    const createItem = (key, value, type) => {
      let element = TAG_TEMPLATES.item.replace('%KEY%', key);
      if (type === 'string') {
        element = element.replace('%VALUE%', '"' + value + '"');
      } else {
        element = element.replace('%VALUE%', value);
      }
      element = element.replace('%TYPE%', type);
      return element;
    };

    const createCollapsibleItem = (key, value, type, children) => {
      const tpl = collapsible ? 'itemCollapsibleOpen' : 'itemCollapsible';
      let element = TAG_TEMPLATES[tpl].replace('%KEY%', key);
      element = element.replace('%VALUE%', type);
      element = element.replace('%TYPE%', type);
      element = element.replace('%CHILDREN%', children);
      return element;
    };

    const handleChildren = (key, value, type) => {
      let children = '';
      for (const item in value) {
        const key = item;
        const val = value[key];
        children += handleItem(key, val);
      }
      return createCollapsibleItem(key, value, type, children);
    };

    const handleItem = (key, value) => {
      const type = typeof value;
      if (value && typeof value === 'object') {
        return handleChildren(key, value, type);
      }
      return createItem(key, value, type);
    };

    const parseObject = responseJson => {
      let displayJson = '<div class="Jsonviewer">';
      for (const item in responseJson) {
        const key = item;
        const value = responseJson[key];
        displayJson += handleItem(key, value);
      }
      displayJson += '</div>';
      return displayJson;
    };

    this.refs.jsonviewer.innerHTML = parseObject(json);
  };

  this.on('mount', () => {
    updateJsonViewer();
  });
}
