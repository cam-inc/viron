import { constants as states } from '../states';

export default {
  /**
   * @param {riotx.Context} context
   * @param {Object|null} viron
   * @return {Array}
   */
  all: (context, viron) => {
    context.state.viron = viron;
    return [states.VIRON];
  }
};
