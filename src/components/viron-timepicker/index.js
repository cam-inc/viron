/**
  date-time      : full-date "T" full-time
                 : e.g.) 2018-12-31T23:59:59+0900
                 : e.g.) 2018-12-31T23:59:59Z
  full-date      : date-fullyear "-" date-month "-" date-mday
                 : e.g.) 2018-12-31
  full-time      : partial-time time-offset
                 : e.g.) 23:59:59+0900
                 : e.g.) 23:59:59.1234Z
  date-fullyear  : 4DIGIT
                 : e.g.) 2018
  date-month     : 2DIGIT
                 : i.e.) 01 - 12
                 : e.g.) 06
  date-mday      : 2DIGIT
                 : i.e.) 01 - 31
                 : e.g.) 09
  partial-time   : time-hour ":" time-minute ":" time-second [time-secfrac]
                 : e.g.) 23:59:59
                 : e.g.) 23:59:59.1234
  time-hour      : 2DIGIT
                 : i.e.) 00 - 23
                 : e.g.) 09
  time-minute    : 2DIGIT
                 : i.e.) 00 - 59
                 : e.g.) 12
  time-second    : 2DIGIT
                 : i.e.) 00 - 59
                 : e.g.) 12
  time-offset    : "Z" / time-numoffset
                 : e.g.) Z
                 : e.g.) +09:00
  time-numoffset : ("+" / "-") time-hour ":" time-minute
                 : e.g.) +09:00
                 : e.g.) -09:00
  time-secfrac   : "." 1*DIGIT
                 : e.g.) .1
                 : e.g.) .123
*/
// TODO: timezone指定が可能になったら対応すること。
// TODO: @see: https://github.com/xx45/dayjs/issues/46
import dayjs from 'dayjs';
import times from 'mout/function/times';
import lpad from 'mout/string/lpad';

window._dd = dayjs;

export default function() {
  let d;
  if (!dayjs(this.opts.val).isValid()) {
    d = dayjs();
  } else {
    d = dayjs(this.opts.val);
  }
  this.date_time = null;
  this.full_date = null;
  this.full_time = null;
  this.date_fullyear = null;
  this.date_month = null;
  this.date_mday = null;
  this.partial_time = null;
  this.time_hour = null;
  this.time_minute = null;
  this.time_second = null;
  this.time_offset = null;
  this.time_numoffset = null;
  this.time_secfram = '';
  const updateDate = () => {
    this.date_time = d.format('YYYY-MM-DDTHH:mm:ssZZ');
    this.full_date = d.format('YYYY-MM-DD');
    this.full_time = d.format('HH:mm:ssZ');
    this.date_fullyear = d.format('YYYY');
    this.date_month = d.format('MM');
    this.date_mday = d.format('DD');
    this.partial_time = d.format('HH:mm:ss');
    this.time_hour = d.format('HH');
    this.time_minute = d.format('mm');
    this.time_second = d.format('ss');
    this.time_offset = d.format('ZZ');
    this.time_numoffset = d.format('ZZ');
    this.time_secfram = '';
  };
  updateDate();

  let c = d.clone();
  this.c_year = null;
  this.c_month = null;
  this.c_week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  this.c_dates = [];
  const updateCalendar = () => {
    this.c_year = c.year();
    this.c_month = c.month() + 1;
    this.c_dates = [];
    const start = c.startOf('month');
    const end = c.endOf('month');
    // 1日~最終日まで追加。
    times(end.date(), i => {
      this.c_dates.push({
        d: start.add(i, 'day'),
        num: i + 1
      });
    });
    // 前月分を追加。
    // dayjs().day()が何故か使えないので$Wで取得する。
    const startW = start.$W;
    times(startW, i => {
      const d = start.subtract(i + 1, 'day');
      this.c_dates.unshift({
        d,
        num: d.date(),
        isPrev: true
      });
    });
    // 次月分を追加。
    const endW = end.$W;
    times(6 - endW, i => {
      const d = end.add(i + 1, 'day');
      this.c_dates.push({
        d,
        num: d.date(),
        isNext: true
      });
    });
  };
  updateCalendar();

  this.hours = [];
  const updateHours = () => {
    this.hours = [];
    times(24, i => {
      this.hours.push(lpad(i, 2, '0'));
    });
  };
  updateHours();

  this.minutes = [];
  const updateMinutes = () => {
    this.minutes = [];
    times(60, i => {
      this.minutes.push(lpad(i, 2, '0'));
    });
  };
  updateMinutes();

  this.seconds = [];
  const updateSeconds = () => {
    this.seconds = [];
    times(60, i => {
      this.seconds.push(lpad(i, 2, '0'));
    });
  };
  updateSeconds();

  this.offsets = [];
  const updateOffsets = () => {
    this.offsets = [];
    times(25, i => {
      const diff = i - 12;
      let prefix = '';
      if (diff > 0) {
        prefix = '+';
      } else if (diff < 0) {
        prefix = '-';
      }
      this.offsets.push(`${prefix}${lpad(Math.abs(diff), 2, '0')}00`);
    });
    this.offsets.push({
      label: 'Z',
      val: 'Z'
    });
  };
  updateOffsets();

  const triggerChangeEvent = () => {
    if (!this.opts.onchange) {
      return;
    }
    this.opts.onchange(d.toISOString());
  };

  this.handleCalendarPrevTap = () => {
    c = c.subtract(1, 'month');
    updateCalendar();
    this.update();
  };

  this.handleCalendarNextTap = () => {
    c = c.add(1, 'month');
    updateCalendar();
    this.update();
  };

  this.handleCalendarDateTap = e => {
    const item = e.item.item;
    const _d = item.d;
    d = d.set('year', _d.year());
    d = d.set('month', _d.month());
    d = d.set('date', _d.date());
    updateDate();
    updateCalendar();
    this.update();
    triggerChangeEvent();
  };

  this.handleHourTap = e => {
    const item = e.item.item;
    const hour = Number(item);
    d = d.set('hour', hour);
    updateDate();
    this.update();
    triggerChangeEvent();
  };

  this.handleMinuteTap = e => {
    const item = e.item.item;
    const minute = Number(item);
    d = d.set('minute', minute);
    updateDate();
    this.update();
  };

  this.handleSecondTap = e => {
    const item = e.item.item;
    const second = Number(item);
    d = d.set('second', second);
    updateDate();
    this.update();
    triggerChangeEvent();
  };

  this.handleOffsetTap = e => {
    const offset = e.item.item;
    d.$zoneStr = offset;
    updateDate();
    this.update();
  };
}
