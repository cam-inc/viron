import moment from 'moment';
import times from 'mout/function/times';

export default function() {

  this.isShowTimepicker = false;
  this.handleInputTime = () => {
    this.isShowTimepicker = true;
  };

  const format = date => {
    return date.format('HH:mm:ssZ');
  };

  const digitNum = num => {
    return num = ('0' + num).slice(-2);
  };

  let fulltime = this.opts.date;

  this.displayDate = moment.utc(fulltime);
  this.displayFormatDate = format(this.displayDate);

  this.on('update', () => {
    this.displayDate = moment.utc(fulltime);
    this.displayFormatDate = format(this.displayDate);
  }).on('updated', () => {
    this.rebindTouchEvents();
  });

  this.generateHours = () => {
    const MAX_DISPLAY_HOURS = 24;
    const hours = [];
    times(MAX_DISPLAY_HOURS, i => {
      const date = this.displayDate.clone().set('hours',i);
      const displayNum = digitNum(i);
      hours[i] = {
        'date': date,
        'displayTime': displayNum,
        'isSelected': format(date) === format(this.displayDate)
      };
    });
    return hours;
  };

  this.generateMinutes = () => {
    const MAX_DISPLAY_MINUTES = 60;
    const minutes = [];
    times(MAX_DISPLAY_MINUTES, i => {
      const date = this.displayDate.clone().set('minutes',i);
      const displayNum = digitNum(i);
      minutes[i] = {
        'date': date,
        'displayTime': displayNum,
        'isSelected': format(date) === format(this.displayDate)
      };
    });
    return minutes;
  };

  this.generateSeconds = () => {
    const MAX_DISPLAY_SECONDS = 60;
    const seconds = [];
    times(MAX_DISPLAY_SECONDS, i => {
      const date = this.displayDate.clone().set('seconds',i);
      const displayNum = digitNum(i);
      seconds[i] = {
        'date': date,
        'displayTime': displayNum,
        'isSelected': format(date) === format(this.displayDate)
      };
    });
    return seconds;
  };

  this.handleSelectItem = date => {
    fulltime = date;
    this.update();
  };

}
