import moment from 'moment';
import times from 'mout/function/times';

export default function() {

  const format = date => {
    return date.format('HH:mm:ss');
  };

  const digitNum = num => {
    return ('0' + num).slice(-2);
  };

  const colon = ':';

  this.momentDate = moment.utc(this.opts.date);
  this.displayFormatDate = format(this.momentDate);

  this.on('update', () => {
    this.momentDate = moment.utc(this.opts.date);
    this.displayFormatDate = format(this.momentDate);
  }).on('updated', () => {
    this.rebindTouchEvents();
    let splitsFormatDate = this.displayFormatDate.split(colon, 3);
    scrollSelected(Number(splitsFormatDate[0]),'hour');
    scrollSelected(Number(splitsFormatDate[1]),'minute');
    scrollSelected(Number(splitsFormatDate[2]),'second');
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
        'isSelected': format(date) === this.displayFormatDate,
        'scroll': i
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
        'isSelected': format(date) === this.displayFormatDate,
        'scroll': i
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
        'isSelected': format(date) === this.displayFormatDate,
        'scroll': i
      };
    });
    return seconds;
  };

  this.handleSelectItem = date => {
    let formatDate = date.toISOString();
    this.opts.onchange(formatDate);
  };

  const scrollSelected = (scroll, datetype) => {
    if(datetype === 'hour'){
      this.refs.hourscroll.scrollTop = scroll * 20;
    }else if(datetype === 'minute'){
      this.refs.minutescroll.scrollTop = scroll * 20;
    }else if(datetype === 'second'){
      this.refs.secondscroll.scrollTop = scroll * 20;
    }
  };
  this.handleInputTap = () => {
    this.opts.ontoggle(!this.opts.isshown);
  };
}
