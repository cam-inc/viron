import ObjectAssign from 'object-assign';

export default function() {
  const optimizedEndpoint = ObjectAssign({}, this.opts.endpoint);
  // token情報は不要。
  delete optimizedEndpoint.token;
  const encodedEndpoint = encodeURIComponent(JSON.stringify(optimizedEndpoint));
  const value = `${location.origin}/#/endpointimport?endpoint=${encodedEndpoint}`;

  this.data = {
    // background: 'green',
    // backgroundAlpha: 0.8,
    // element: <Canvas>,
    // foreground: 'blue',
    // foregroundAlpha: 0.8,
    level: 'L',
    mime: 'image/png',
    // padding: 5,
    size: 200,
    value
  };
}
