import moment from 'moment';
import times from 'mout/function/times';

export default function() {
  this.selectedDate = moment(this.opts.date || null);
  this.displayDate = moment(this.opts.displaydate || {});
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
    this.selectedDate = moment(this.opts.date || null);
    this.displayDate = moment(this.opts.displaydate || {});
  }).on('updated', () => {
    this.rebindTouchEvents();
  });

  const format = (date) => {
    return date.format('YYYY-MM-DD');
  };

  this.generateCalendar = () => {
    const calendar = [];
    const MAX_DISPLAY_DAYS = 42;
    const firstDayIndex = this.displayDate.clone().date(1).day();
    const lastMonthMaxDate = this.displayDate.clone().subtract(1, 'month').daysInMonth();
    const currentMonthMaxDate = this.displayDate.daysInMonth();

    times(firstDayIndex, (i) => {
      i += 1;
      const lastMonth = this.displayDate.clone().subtract(1, 'month').date(lastMonthMaxDate - firstDayIndex + i);
      calendar[i - 1] = {
        'date': lastMonth,
        'isCurrentMonth': false,
        'isToday': format(lastMonth) === format(moment()),
        'isSelected': format(lastMonth) === format(this.selectedDate)
      };
    });

    let lastIndex = 0;
    times(currentMonthMaxDate, (i) => {
      let thisMonth = this.displayDate.clone().date(i + 1);
      calendar[firstDayIndex + i] = {
        'date': thisMonth,
        'isCurrentMonth': true,
        'isToday': format(thisMonth) === format(moment()),
        'isSelected': format(thisMonth) === format(this.selectedDate)
      };
      lastIndex = firstDayIndex + i;
    });

    lastIndex += 1;
    let index = MAX_DISPLAY_DAYS - lastIndex;
    times(index, (i) => {
      i += 1;
      const nextMonth = this.displayDate.clone().add(1, 'month').date(i);
      calendar[lastIndex] = {
        'date': nextMonth,
        'isCurrentMonth': false,
        'isToday': format(nextMonth) === format(moment()),
        'isSelected': format(nextMonth) === format(this.selectedDate)
      };
      lastIndex += 1;
    });

    return calendar;
  };

  this.handleNextButtonPat = () => {
    const newDateText =  format(this.displayDate.add(1, 'month'));
    this.opts.ondisplaychange(newDateText);
  };

  this.handlePrevButtonPat = () => {
    const newDateText = format(this.displayDate.subtract(1, 'month'));
    this.opts.ondisplaychange(newDateText);
  };

  this.handleCellPat = (newDate) => {
    this.opts.onchange(format(newDate));
  };

  this.handleTap = () => {
    this.opts.ontoggle(!this.opts.isshown);
  };
}