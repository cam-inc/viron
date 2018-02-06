import ObjectAssign from 'object-assign';

export default function() {
  const store = this.riotx.get();

  const optimizedEndpoint = ObjectAssign({}, {
    url: this.opts.endpoint.url,
    memo: this.opts.endpoint.memo
  });
  const version = store.getter('application.latestVersion');
  const encodedEndpoint = encodeURIComponent(JSON.stringify(optimizedEndpoint));
  const value = `https://cam-inc.github.io/viron/${version}/#/endpointimport?endpoint=${encodedEndpoint}`;

  this.data = {
    size: 200,
    value
  };
}
