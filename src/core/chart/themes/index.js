import whiteTheme from './white';
import Highcharts from '../index';

export default {
  applyTheme: (name = 'white') => {
    let theme;
    switch (name) {
    case 'white':
      theme = whiteTheme;
      break;
    default:
      break;
    }
    Highcharts.theme = theme;
    Highcharts.setOptions(Highcharts.theme);
  }
};
