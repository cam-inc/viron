import moment from 'moment';

export default function() {
  this.dates = moment();
  debugger;
  this.isShow = false;
  this.lang = 'ja';
  this.context = {
    'month': {
      'ja': [
        '１月', '２月', '３月', '４月', '５月', '６月', '７月', '８月', '９月', '１０月', '１１月', '１２月'
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
    'calendar': [
      {
        'value': 30,
        'month': 7
      },
      {
        'value': 31,
        'month': 7
      },
      {
        'value': 1,
        'month': 8
      },
      {
        'value': 2,
        'month': 8
      },
      {
        'value': 3,
        'month': 8
      },
      {
        'value': 4,
        'month': 8
      },
      {
        'value': 5,
        'month': 8
      },
      {
        'value': 6,
        'month': 8
      },
      {
        'value': 7,
        'month': 8
      },
      {
        'value': 8,
        'month': 8
      },
      {
        'value': 9,
        'month': 8
      },
      {
        'value': 10,
        'month': 8
      },
      {
        'value': 11,
        'month': 8
      },
      {
        'value': 12,
        'month': 8
      },
      {
        'value': 13,
        'month': 8
      },
      {
        'value': 14,
        'month': 8
      },
      {
        'value': 15,
        'month': 8
      },
      {
        'value': 16,
        'month': 8
      },
      {
        'value': 17,
        'month': 8
      },
      {
        'value': 18,
        'month': 8
      },
      {
        'value': 19,
        'month': 8
      },
      {
        'value': 20,
        'month': 8
      },
      {
        'value': 21,
        'month': 8
      },
      {
        'value': 22,
        'month': 8
      },
      {
        'value': 23,
        'month': 8
      },
      {
        'value': 24,
        'month': 8
      },
      {
        'value': 25,
        'month': 8
      },
      {
        'value': 26,
        'month': 8
      },
      {
        'value': 27,
        'month': 8
      },
      {
        'value': 28,
        'month': 8
      },
      {
        'value': 29,
        'month': 8
      },
      {
        'value': 30,
        'month': 8
      },
      {
        'value': 31,
        'month': 8
      },
      {
        'value': 1,
        'month': 9
      },
      {
        'value': 2,
        'month': 9
      },
      {
        'value': 3,
        'month': 9
      },
      {
        'value': 4,
        'month': 9
      },
      {
        'value': 5,
        'month': 9
      },
      {
        'value': 6,
        'month': 9
      },
      {
        'value': 7,
        'month': 9
      },
      {
        'value': 8,
        'month': 9
      },
      {
        'value': 9,
        'month': 9
      }
    ]
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
