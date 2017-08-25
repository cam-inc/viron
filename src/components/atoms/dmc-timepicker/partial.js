import moment from 'moment';
import times from 'mout/function/times';

export default function() {

  // this.partialTime = moment(this.opts.partialtime, 'HH:mm:ss');
  this.displaySelectedItemHour = '00';
  this.displaySelectedItemMinute = '00';
  this.displaySelectedItemSecond = '00';
  this.displayPartialTime = `${this.displaySelectedItemHour}:${this.displaySelectedItemMinute}:${this.displaySelectedItemSecond}`;

  this.on('update', () => {
    this.displayPartialTime = `${this.displaySelectedItemHour}:${this.displaySelectedItemMinute}:${this.displaySelectedItemSecond}`;
  }).on('updated', () => {
    this.rebindTouchEvents();
  });

  const format = date => {
    return date.format('HH:mm:ss');
  };

  const digitNum = num => {
    return num = ('0' + num).slice(-2);
  };

  this.generateHours = () => {
    const MAX_DISPLAY_HOURS = 24;
    const hours = [];

    times(MAX_DISPLAY_HOURS, i => {
      // const date = this.partialTime.clone().add(i, 'hours');
      const displayNum = digitNum(i);
      hours[i] = {
        'date': i,
        'displayTime': displayNum,
        // 'isSelected': format(date)
      };
    });
    return hours;
  };

  this.generateMinutes = () => {
    const MAX_DISPLAY_MINUTES = 60;
    const minutes = [];
    times(MAX_DISPLAY_MINUTES, i => {
      const displayNum = digitNum(i);
      minutes[i] = {
        'date': i,
        'displayTime': displayNum
      };
    });
    return minutes;
  };

  this.generateSeconds = () => {
    const MAX_DISPLAY_SECONDS = 60;
    const seconds = [];
    times(MAX_DISPLAY_SECONDS, i => {
      const displayNum = digitNum(i);
      seconds[i] = {
        'date': i,
        'displayTime': displayNum
      };
    });
    return seconds;
  };

  this.handleSelectHour = date => {
    this.selectedItemHour = date;
    this.displaySelectedItemHour = digitNum(date);
    this.update();
  };
  this.handleSelectMinute = date => {
    this.selectedItemMinute = date;
    this.displaySelectedItemMinute = digitNum(date);
    this.update();
  };
  this.handleSelectSecond = date => {
    this.selectedItemSecond = date;
    this.displaySelectedItemSecond = digitNum(date);
    this.update();
  };
}
