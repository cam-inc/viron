import moment from 'moment';
import times from 'mout/function/times';

export default function() {

  this.isShowTimepicker = false;
  this.handleInputTime = () => {
    this.isShowTimepicker = true;
  };

  this.generateHours = () => {
    const MAX_DISPLAY_HOURS = 24;
    const hours = [];
    times(MAX_DISPLAY_HOURS, (i) => {
      let r = ('0' + i).slice(-2);
      hours[i] = {
        hour: r
      };
    });
    return hours;
  };

  this.generateMinutes = () => {
    const MAX_DISPLAY_MINUTES = 60;
    const minutes = [];
    times(MAX_DISPLAY_MINUTES, (i) => {
      let r = ('0' + i).slice(-2);
      minutes[i] = {
        minute: r
      };
    });
    return minutes;
  };

  this.generateSeconds = () => {
    const MAX_DISPLAY_SECONDS = 60;
    const seconds = [];
    times(MAX_DISPLAY_SECONDS, (i) => {
      let r = ('0' + i).slice(-2);
      seconds[i] = {
        second: r
      };
    });
    return seconds;
  };

  let defaultTime = '00:00:00-09:00';

  let setTime = moment().format(defaultTime, 'HH:mm:ss-ZZ');

  this.displayTime = setTime;
}
