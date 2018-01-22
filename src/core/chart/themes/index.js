import midnightTheme from './midnight';
import standardTheme from './standard';
import terminalTheme from './terminal';
import Highcharts from '../index';

export default {
  applyTheme: (name = 'standard') => {
    let theme;
    switch (name) {
    case 'standard':
      theme = standardTheme;
      break;
    case 'midnight':
      theme = midnightTheme;
      break;
    case 'terminal':
      theme = terminalTheme;
      break;
    default:
      break;
    }
    Highcharts.theme = theme;
    Highcharts.setOptions(Highcharts.theme);
  }
};
