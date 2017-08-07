import moment from 'moment';

export default function() {
  this.dates = moment();
  debugger;
  this.isShow = false;
  this.lang = 'ja';
  this.context = {
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
    'calendar': []
  };

  this.updateCalendarView = () => {
    let firstDay = this.dates.clone().date(1).day();
    let lastMonthMaxDate = this.dates.clone().month(-1).daysInMonth();
    let currentMonthMaxDate = this.dates.daysInMonth();
    const MAX_DISPLAY_DAYS = 42;

    this.context.calendar = [];

    for(let i = 1; i <= firstDay; i += 1) {
      this.context.calendar[i - 1] = {
        'value': lastMonthMaxDate - firstDay + i,
        'month': this.dates.clone().month() - 1 
      };
    }

    let lastIndex = 0;
    for(let i = 0; i < currentMonthMaxDate; i += 1) {
      this.context.calendar[firstDay + i] = {
        'value': i + 1,
        'month': this.dates.clone().month()
      };
      lastIndex = firstDay + i;
    }

    lastIndex += 1;

    let index = MAX_DISPLAY_DAYS - lastIndex;
    for(let i = 1; i <= index; i += 1) {
      this.context.calendar[lastIndex] = {
        'value': i,
        'month': this.dates.clone().month() + 1
      };
      lastIndex += 1;
    }
  };

  this.toggle = () => {
    this.isShow = (this.isShow) ? false : true;
    this.refs.form.focus();
  };

  this.goNext = () => {
    debugger;
    console.log(this.dates.format('YYYY-MM-DD'));
    console.log(this.dates.month(1).format('YYYY-MM-DD'));
    // this.dates = this.dates.month(1);
    this.updateCalendarView();
    this.update();
    //this.update();
  };

  this.handleFormSubmit = e => {
    e.preventDefault();
    this.opts.onchange && this.opts.onchange(this.opts.text, this.opts.id);
  };

  this.updateCalendarView();
}
