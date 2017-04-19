export default {
  show: function (callback) {

  },
  update: function (key, callback) {
    this.commit("current_update", key);

    callback(null);
  }
}
