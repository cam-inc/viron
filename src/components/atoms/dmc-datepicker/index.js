import moment from 'moment';

export default function() {
  this.dates = moment();
  this.today = moment();
  this.selectedDate = null;
  this.isShown = false;
  this.calendar = [];
  this.lang = 'ja';
  this.data = {
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

  const updateCalendarView = () => {
    let firstDay = this.dates.clone().date(1).day();
    const MAX_DISPLAY_DAYS = 42;

    this.calendar = [];

    let lastMonthMaxDate = this.dates.clone().subtract(1, 'month').daysInMonth();
    for(let i = 1; i <= firstDay; i += 1) {
      let lastMonth = this.dates.clone().subtract(1, 'month').date(lastMonthMaxDate - firstDay + i);
      this.calendar[i - 1] = {
        'date': lastMonth
      };
    }

    let lastIndex = 0;
    let currentMonthMaxDate = this.dates.daysInMonth();
    for(let i = 0; i < currentMonthMaxDate; i += 1) {
      let thisMonth = this.dates.clone().date(i + 1);
      this.calendar[firstDay + i] = {
        'date': thisMonth
      };
      lastIndex = firstDay + i;
    }

    lastIndex += 1;
    let index = MAX_DISPLAY_DAYS - lastIndex;

    for(let i = 1; i <= index; i += 1) {
      let nextMonth = this.dates.clone().add(1, 'month').date(i);
      this.calendar[lastIndex] = {
        'date': nextMonth
      };
      lastIndex += 1;
    }
  };

  this.format = date => {
    return moment(date).format('YYYY-MM-DD');
  };

  this.toggle = () => {
    this.isShown = (this.isShown) ? false : true;
    this.refs.form.focus();
  };

  this.goPrev = () => {
    this.dates.subtract(1, 'month');
    updateCalendarView();
    this.update();
  };

  this.goNext = () => {
    this.dates.add(1, 'month');
    updateCalendarView();
    this.update();
  };

  this.handleDateInput = e => {
    let clickDate = e.item.cell.date;
    const newText = this.format(clickDate);
    this.opts.onchange && this.opts.onchange(newText, this.opts.id);
    this.dates = clickDate;
    this.selectedDate = clickDate.clone();
    this.toggle();
    updateCalendarView();
  };

  this.handleFormSubmit = e => {
    e.preventDefault();
    this.opts.onchange && this.opts.onchange(this.opts.text, this.opts.id);
  };

  this.handleInputInput = e => {
    e.preventUpdate = true;
    const newText = e.target.value.replace(/　/g, ' ');// eslint-disable-line no-irregular-whitespace
    this.opts.onchange && this.opts.onchange(newText, this.opts.id);
    if(moment(newText, 'YYYY-MM-DD', true).isValid()) {
      this.dates = moment(newText);
      this.selectedDate = moment(newText).clone();
      this.isShown = false;
      this.update();
      updateCalendarView();
    } else {
      this.selectedDate = null;
    }
  };

  this.handleInputChange = e => {
    // `blur`時に`change`イベントが発火する。
    // 不都合な挙動なのでイベント伝播を止める。
    e.stopPropagation();
  };

  updateCalendarView();
}
