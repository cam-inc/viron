import moment from 'moment';
export default function() {

  this.isShowTimepicker = false;
  this.handleInputTime = () => {
    this.isShowTimepicker = true;
  };

  this.partialTimeHour = '';
  this.partialTimeMinute = '';
  this.partialTimeSecond ='';

  let defaultPartialTime = '00:00:00';

  let defaultOffsetTime = '-00:00';

  let partialTime = moment().format(defaultPartialTime, 'HH:mm:ss');

  let offsetTime = moment().format(defaultOffsetTime, 'ZZ');

  let defaultFullTime = defaultPartialTime + defaultOffsetTime;

  let fullTime = moment().format(defaultFullTime, 'HH:mm:ss ZZ');

  this.partialTime = partialTime;

  this.offsetTime = offsetTime;

  this.fullTime = fullTime;
}
