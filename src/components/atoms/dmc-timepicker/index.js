import moment from 'moment';
import times from 'mout/function/times';
import isUndefined from 'mout/lang/isUndefined';

export default function() {

  // データをPartialTime(HH:mm:ss)のフォーマットにする関数
  const format = date => {
    return date.format('HH:mm:ss');
  };

  // 数字を二桁にする関数
  const digitNum = num => {
    return ('0' + num).slice(-2);
  };

  // スクロールイベントに使う関数
  const scrollSelected = (scroll, datetype) => {

    if(this.refs.hourlist && datetype === 'hour'){
      this.refs.hourlist.scrollTop = scroll * document.querySelector('.Partialtime__listItem').clientHeight;
    }

    if(this.refs.minutelist && datetype === 'minute'){
      this.refs.minutelist.scrollTop = scroll * document.querySelector('.Partialtime__listItem').clientHeight;
    }

    if(this.refs.secondlist && datetype === 'second'){
      this.refs.secondlist.scrollTop = scroll * document.querySelector('.Partialtime__listItem').clientHeight;
    }
  };

  if (!isUndefined(this.opts.date)) {
    this.momentDate = moment.utc(this.opts.date);
    this.displayFormatDate = format(this.momentDate);
  } else {
    this.momentDate = moment.utc().set('hour', 0).set('minute', 0).set('second', 0).set('milliseconds', 0);
    this.displayFormatDate = '';
  }

  this.on('update', () => {
    if (!isUndefined(this.opts.date)) {
      this.momentDate = moment.utc(this.opts.date);
      this.displayFormatDate = format(this.momentDate);
    } else {
      this.momentDate = moment.utc().set('hour', 0).set('minute', 0).set('second', 0).set('milliseconds', 0);
      this.displayFormatDate = format(this.momentDate);
    }
  }).on('updated', () => {
    this.rebindTouchEvents();
    const splitsFormatDate = this.displayFormatDate.split(':', 3);
    scrollSelected(Number(splitsFormatDate[0]),'hour');
    scrollSelected(Number(splitsFormatDate[1]),'minute');
    scrollSelected(Number(splitsFormatDate[2]),'second');
  });

  // itemListの表示
  // 引数に応じて表示する内容を変える。
  this.generateTimes = time => {

    let maxDisplayTime;
    // timeがhourの時MAX_DISPLAY_TIMEに24を設定
    if(time === 'hour'){
      maxDisplayTime = 24;
    }
    // timeがhourの時MAX_DISPLAY_TIMEに60を設定
    if(time === 'minute'){
      maxDisplayTime = 60;
    }
    // timeがhourの時MAX_DISPLAY_TIMEに60を設定
    if(time === 'second'){
      maxDisplayTime = 60;
    }
    // 配列timeを用意
    const timeValue = [];
    times(maxDisplayTime, i => {
      const date = this.momentDate.clone().set(time,i);
      const displayNum = digitNum(i);
      timeValue[i] = {
        date,
        'displayTime': displayNum,
        'isSelected': format(date) === this.displayFormatDate,
        'scroll': i
      };
    });
    return timeValue;
  };

  this.handleSelectItemTap = date => {
    let formatDate = date.toISOString();
    this.opts.onchange(formatDate);
  };
  this.handleInputTap = () => {
    this.opts.ontoggle(!this.opts.isshown);
  };
}
