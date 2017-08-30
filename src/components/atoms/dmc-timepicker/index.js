import moment from 'moment';
import times from 'mout/function/times';

export default function() {

  const format = date => {
    return date.format('HH:mm:ss');
  };

  const digitNum = num => {
    return ('0' + num).slice(-2);
  };

  this.momentDate = moment.utc(this.opts.date);
  this.displayFormatDate = format(this.momentDate);

  this.on('update', () => {
    this.momentDate = moment.utc(this.opts.date);
    this.displayFormatDate = format(this.momentDate);
  }).on('updated', () => {
    this.rebindTouchEvents();
  });

  this.generateHours = () => {
    const MAX_DISPLAY_HOURS = 24;
    const hours = [];
    times(MAX_DISPLAY_HOURS, i => {
      const date = this.momentDate.clone().set('hours',i);
      const displayNum = digitNum(i);
      hours[i] = {
        'date': date,
        'displayTime': displayNum,
        'isSelected': format(date) === this.displayFormatDate
      };
    });
    return hours;
  };

  this.generateMinutes = () => {
    const MAX_DISPLAY_MINUTES = 60;
    const minutes = [];
    times(MAX_DISPLAY_MINUTES, i => {
      const date = this.momentDate.clone().set('minutes',i);
      const displayNum = digitNum(i);
      minutes[i] = {
        'date': date,
        'displayTime': displayNum,
        'isSelected': format(date) === this.displayFormatDate
      };
    });
    return minutes;
  };

  this.generateSeconds = () => {
    const MAX_DISPLAY_SECONDS = 60;
    const seconds = [];
    times(MAX_DISPLAY_SECONDS, i => {
      const date = this.momentDate.clone().set('seconds',i);
      const displayNum = digitNum(i);
      seconds[i] = {
        'date': date,
        'displayTime': displayNum,
        'isSelected': format(date) === format(this.momentDate)
      };
    });
    return seconds;
  };

  this.handleSelectItem = date => {
    let formatDate = date.toISOString();
    this.opts.onchange(formatDate);
  };

  this.handleInputTap = () => {
    this.opts.ontoggle(!this.opts.isshown);
  };
}
