import moment from 'moment';
import times from 'mout/function/times';

export default function() {

  this.isShowTimepicker = false;
  this.handleInputTime = () => {
    this.isShowTimepicker = true;
  };

  const format = date => {
    return date.format('HH:mm:ss');
  };

  const digitNum = num => {
    return num = ('0' + num).slice(-2);
  };

  const space = ' ';
  const colon = ':';

  this.defaultPartialTime = this.opts.date;

  const fulltimesplit = this.defaultPartialTime.split(space, 2);
  var partialtime = fulltimesplit[0];
  var offsettime = fulltimesplit[1];

  const partialtimesplit = partialtime.split(colon, 3);
  var partialtimehour = partialtimesplit[0];
  var partialtimeminute = partialtimesplit[1];
  var partialtimesecond = partialtimesplit[2];
  var partialtimehournum = Number(partialtimehour);
  var partialtimeminutenum = Number(partialtimeminute);
  var partialtimesecondnum = Number(partialtimesecond);

  //
  //TODO: offsetがZのときの処理を追加する
  //
  if(offsettime === 'Z'){

  }else{
    const offsettimesplit = offsettime.split(colon, 2);
    var offsettimehour = offsettimesplit[0];
    var offsettimeminute = offsettimesplit[1];
    var offsettimehour = Number(offsettimehour);
    var offsettimeminute = Number(offsettimeminute);
  }

  //TODO:変数化
  this.selectedItemHour = partialtimehournum;
  this.selectedItemMinute = partialtimeminutenum;
  this.selectedItemSecond = partialtimesecondnum;

  this.partialTime = `${this.selectedItemHour}:${this.selectedItemMinute}:${this.selectedItemSecond}`;

  //TODO:変数化
  this.displaySelectedItemHour = partialtimehour;
  this.displaySelectedItemMinute = partialtimeminute;
  this.displaySelectedItemSecond = partialtimesecond;

  this.displayPartialTime = `${this.displaySelectedItemHour}:${this.displaySelectedItemMinute}:${this.displaySelectedItemSecond}`;

  this.generateHours = () => {
    const MAX_DISPLAY_HOURS = 24;
    const hours = [];

    times(MAX_DISPLAY_HOURS, i => {
      // const date = this.defaultPartialTime.clone().add(i, 'hours');
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

  this.on('update', () => {
    this.partialTime = `${this.selectedItemHour}:${this.selectedItemMinute}:${this.selectedItemSecond}`;
    this.testTime = `${this.selectedItemHour}:${this.selectedItemMinute}:${this.selectedItemSecond}`;
    // console.log(this.testTime);
    this.displayPartialTime = `${this.displaySelectedItemHour}:${this.displaySelectedItemMinute}:${this.displaySelectedItemSecond}`;
  }).on('updated', () => {
    this.rebindTouchEvents();
  });

  this.handleSelectHour = date => {
    this.selectedItemHour = date;
    console.log(this.selectedItemHour);
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
