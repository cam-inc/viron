export default {
  /**
   * 選択中のendpointIDを返します。
   * @param {riotx.Context} context
   * @return {String|null}
   */
  all: context => {
    return context.state.current;
  }
};
