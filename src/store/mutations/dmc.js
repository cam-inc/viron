import { constants as states } from '../states';

export default {
  /**
   * @param {riotx.Context} context
   * @param {Object|null} dmc
   * @return {Array}
   */
  all: (context, dmc) => {
    context.state.dmc = dmc;
    return [states.DMC];
  }
};
