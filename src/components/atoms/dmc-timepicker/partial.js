import moment from 'moment';
import times from 'mout/function/times';

export default function() {
  // let defaultTime = '00:00:00-09:00';
  // let setTime = moment().format(defaultTime, 'HH:mm:ss-ZZ');
  // this.displayTime = setTime;

  this.selectedDate = moment(this.opts.partialtime || null);

  const format = date => {
    return date.format('MM:hh:ss');
  };

  const digitNum = num => {
    return num = ('0' + num).slice(-2);
  };

  this.generateHours = () => {
    const MAX_DISPLAY_HOURS = 24;
    const hours = [];

    times(MAX_DISPLAY_HOURS, (i) => {
      const date = '';
      const displayNum = digitNum(i);
      hours[i] = {
        'date': date,
        'hour': displayNum,
      };
    });
    return hours;
  };

  this.generateMinutes = () => {
    const MAX_DISPLAY_MINUTES = 60;
    const minutes = [];
    times(MAX_DISPLAY_MINUTES, (i) => {
      const displayNum = digitNum(i);
      const date = '';
      minutes[i] = {
        'date': date,
        'minute': displayNum
      };
    });
    return minutes;
  };

  this.generateSeconds = () => {
    const MAX_DISPLAY_SECONDS = 60;
    const seconds = [];
    times(MAX_DISPLAY_SECONDS, (i) => {
      const displayNum = digitNum(i);
      const date = '';
      seconds[i] = {
        'date': date,
        'second': displayNum
      };
    });
    return seconds;
  };

  this.handleSelectHour = () => {
    console.log('hoge1');
  };
  this.handleSelectMinute = () => {
    console.log('hoge2');
  };
  this.handleSelectSecond = () => {
    console.log('hoge3');
  };
}
