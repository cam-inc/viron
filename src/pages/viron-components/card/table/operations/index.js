import find from 'mout/array/find';
import map from 'mout/array/map';

export default function() {
  this.list = map(this.opts.operations, operation => {
    return {
      id: operation.operationId,
      label: operation.summary || operation.operationId
    };
  });

  this.handleItemSelect = operationId => {
    this.close();
    const operationObject = find(this.opts.operations, operation => {
      return (operation.operationId === operationId);
    });
    this.opts.onSelect(operationObject);
  };
}
