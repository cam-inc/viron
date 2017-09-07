import moment from 'moment';
import times from 'mout/function/times';
import isUndefined from 'mout/lang/isUndefined';

export default function() {

  const format = (date) => {
    return date.format('YYYY-MM-DD');
  };

  /**
   *  moment.utc()のオブジェクトから指定した型にフォーマットする為に使用
   * @param {String} date
   * @param {String} displaydate
   */
  const updateDate = (date,displaydate) => {
    if (!isUndefined(date)) {
      this.selectedDate = moment.utc(date || null);
      this.displayFormatDate = format(this.selectedDate);
      this.displayDate = moment.utc(displaydate || {});
      console.log(this.displayDate);
    } else {
      this.selectedDate = moment.utc(date).set('hour', 0).set('minute', 0).set('second', 0).set('milliseconds', 0);
      this.displayFormatDate = '';
      this.displayDate = moment.utc(displaydate || {}).set('hour', 0).set('minute', 0).set('second', 0).set('milliseconds', 0);
    }
  }

  updateDate(this.opts.date,this.opts.displaydate);
  this.settingDateName = {
    'month': {
      'ja': [
        '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
      ],
      'en': [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
      ]
    },
    'days': {
      'ja': [
        '日','月', '火', '水', '木', '金', '土'
      ],
      'en': [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
      ]
    },
  };

  this.on('update', () => {
    toMomentDate(this.opts.date,this.opts.displaydate);
    if(!this.displayFormatDate){
      this.displayFormatDate = format(this.selectedDate);
    }
  }).on('updated', () => {
    this.rebindTouchEvents();
  });

  this.generateCalendar = () => {
    const MAX_DISPLAY_DAYS = 42;
    const calendar = [];
    const currentDirstDate = this.displayDate.clone().date(1);
    const displayFirstDate = currentDirstDate.clone().subtract(currentDirstDate.day(), 'days');

    times(MAX_DISPLAY_DAYS, (i) => {
      const date = displayFirstDate.clone().add(i, 'days');
      calendar[i] = {
        'date': date,
        'isCurrentMonth': date.month() === this.displayDate.month(),
        'isToday': format(date) === format(moment()),
        'isSelected': format(date) === format(this.selectedDate)
      };
    });

    return calendar;
  };

  this.handleNextButtonPat = () => {
    const newDateText =  this.displayDate.add(1, 'month').toISOString();
    this.opts.ondisplaychange(newDateText);
  };

  this.handlePrevButtonPat = () => {
    const newDateText = this.displayDate.subtract(1, 'month').toISOString();
    this.opts.ondisplaychange(newDateText);
  };

  this.handleCellPat = (newDate) => {
    this.opts.onchange(newDate.toISOString());
  };

  this.handleInputTap = () => {
    this.opts.ontoggle(!this.opts.isshown);
  };
}
