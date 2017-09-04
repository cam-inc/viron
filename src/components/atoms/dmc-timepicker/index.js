import moment from 'moment';
import times from 'mout/function/times';
import isUndefined from 'mout/lang/isUndefined';

export default function() {

  const format = date => {
    return date.format('HH:mm:ss');
  };

  const digitNum = num => {
    return ('0' + num).slice(-2);
  };

  const colon = ':';

  if (!isUndefined(this.opts.date)) {
    this.momentDate = moment.utc(this.opts.date);
    this.displayFormatDate = format(this.momentDate);
  } else {
    this.momentDate = moment.utc().set('hour', 0).set('minute', 0).set('second', 0);
    this.displayFormatDate = '';
  }

  this.on('update', () => {
    if (!isUndefined(this.opts.date)) {
      this.momentDate = moment.utc(this.opts.date);
      this.displayFormatDate = format(this.momentDate);
    } else {
      this.momentDate = moment.utc().set('hour', 0).set('minute', 0).set('second', 0);
      this.displayFormatDate = '';
    }
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

    let clientHeight = document.querySelector('.Partialtime__listItem').clientHeight;

    if(this.refs.hourlist && datetype === 'hour'){
      this.refs.hourlist.scrollTop = scroll * clientHeight;
    }

    if(this.refs.minutelist && datetype === 'minute'){
      this.refs.minutelist.scrollTop = scroll * clientHeight;
    }

    if(this.refs.secondlist && datetype === 'second'){
      this.refs.secondlist.scrollTop = scroll * clientHeight;
    }
  };
  this.handleInputTap = () => {
    this.opts.ontoggle(!this.opts.isshown);
  };
}
