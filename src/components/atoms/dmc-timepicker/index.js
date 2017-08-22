import times from 'mout/function/times';

export default function() {

  this.generateHours = () => {
    const MAX_DISPLAY_HOURS = 24;
    const hours = [];
    times(MAX_DISPLAY_HOURS, (i) => {
      hours[i] = {
        hour: i
      }
    });
    return hours;
  };

  this.generateMinutes = () => {
    const MAX_DISPLAY_MINUTES = 60;
    const minutes = [];
    times(MAX_DISPLAY_MINUTES, (i) => {
      minutes[i] = {
        minute: i
      }
    });
    return minutes;
  };

  this.generateSeconds = () => {
    const MAX_DISPLAY_SECONDS = 60;
    const seconds = [];
    times(MAX_DISPLAY_SECONDS, (i) => {
      seconds[i] = {
        second: i
      }
    });
    return seconds;
  };

  this.isShowTimepicker = false;
  this.handleInputTime = () => {
    this.isShowTimepicker = true;
  };
}
