import moment from 'moment';
import times from 'mout/function/times';

export default function() {

  this.isShowTimepicker = false;
  this.handleInputTime = () => {
    this.isShowTimepicker = true;
  };

  const formatFullTime = date => {
    return date.format('HH:mm:ss Z');
  };

  const formatPartial = date => {
    return date.format('HH:mm:ss');
  };

  const formatOffset = date => {
    return date.format('Z');
  };

  const digitNum = num => {
    return num = ('0' + num).slice(-2);
  };

  const space = ' ';
  const fulltimesplit = this.opts.date.split(space, 2);
  let partialtime = fulltimesplit[0];
  let offsettime = fulltimesplit[1];

  this.displayTime = partialtime;
  this.defaultTime = moment(this.displayTime, 'HH:mm:ss');

  this.on('update', () => {
    this.displayTime = partialtime;
    this.defaultTime = moment(this.displayTime, 'HH:mm:ss');
    console.log(this.defaultTime);
  }).on('updated', () => {
    this.rebindTouchEvents();
  });

  this.generateHours = () => {
    const MAX_DISPLAY_HOURS = 24;
    const hours = [];
    times(MAX_DISPLAY_HOURS, i => {
      const date = this.defaultTime.clone().set('hours', i);
      const displayNum = digitNum(i);
      hours[i] = {
        'date': i,
        'displayTime': displayNum,
        'formatDate': formatPartial(date)
      };
    });
    return hours;
  };

  this.generateMinutes = () => {
    const MAX_DISPLAY_MINUTES = 60;
    const minutes = [];
    times(MAX_DISPLAY_MINUTES, i => {
      const date = this.defaultTime.clone().set('minutes', i)
      const displayNum = digitNum(i);
      minutes[i] = {
        'date': i,
        'displayTime': displayNum,
        'formatDate': formatPartial(date)
      };
    });
    return minutes;
  };

  this.generateSeconds = () => {
    const MAX_DISPLAY_SECONDS = 60;
    const seconds = [];
    times(MAX_DISPLAY_SECONDS, i => {
      const date = this.defaultTime.clone().set('seconds', i)
      const displayNum = digitNum(i);
      seconds[i] = {
        'date': i,
        'displayTime': displayNum,
        'formatDate': formatPartial(date)
      };
    });
    return seconds;
  };

  this.handleSelectHour = date => {
    partialtime = date
    this.update();
  };

  this.handleSelectMinute = date => {
    partialtime = date
    this.update();
  };

  this.handleSelectSecond = date => {
    partialtime = date
    this.update();
  };

}
