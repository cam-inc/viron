export default {
  show: function (callback) {
    // TODO local store
    this.commit("endpoint_show", {
      "http://localhost:3000/swagger.json": {
        name: "Service A",
        tags: ["Local"],
      },
      "http://localhost:3001/swagger.json": {
        name: "Service A",
        tags: ["Development"],
      },
      "http://localhost:3002/swagger.json": {
        name: "Service A",
        tags: ["Staging"],
      },
      "http://localhost:3003/swagger.json": {
        name: "Service A",
        tags: ["Production"],
      },

      "http://localhost:3004/swagger.json": {
        name: "Service B",
        tags: ["Local"],
      },
      "http://localhost:3005/swagger.json": {
        name: "Service B",
        tags: ["Development"],
      },
      "http://localhost:3006/swagger.json": {
        name: "Service B",
        tags: ["Staging"],
      },
      "http://localhost:3007/swagger.json": {
        name: "Service B",
        tags: ["Production"],
      },

    });
    callback(null);
  }
}
