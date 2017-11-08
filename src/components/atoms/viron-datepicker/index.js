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

  const format = date => {
    return date.format('YYYY-MM-DD');
  };

  this.generateCalendar = () => {
    const MAX_DISPLAY_DAYS = 42;
    const calendar = [];
    const currentDirstDate = this.displayDate.clone().date(1);
    const displayFirstDate = currentDirstDate.clone().subtract(currentDirstDate.day(), 'days');

    times(MAX_DISPLAY_DAYS, i => {
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

  this.handleNextButtonPpat = () => {
    const newDateText = format(this.displayDate.add(1, 'month'));
    this.opts.ondisplaychange(newDateText);
  };

  this.handlePrevButtonPpat = () => {
    const newDateText = format(this.displayDate.subtract(1, 'month'));
    this.opts.ondisplaychange(newDateText);
  };

  this.handleCellPpat = newDate => {
    this.opts.onchange(format(newDate));
  };

  this.handleInputTap = () => {
    this.opts.ontoggle(!this.opts.isshown);
  };
}
