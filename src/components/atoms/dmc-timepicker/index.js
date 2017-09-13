import moment from 'moment';
import times from 'mout/function/times';
import isUndefined from 'mout/lang/isUndefined';

// セレクトリストのセルの高さ
const CELL_HEIGHT = 25;

export default function() {

  /**
   *  moment.utc()のオブジェクトから指定した型にフォーマットする為に使用
   * @param {Object} date
   */
  const partialFormat = date => {
    return date.format('HH:mm:ss');
  };

  /**
   *  1桁数字を2桁数字(文字列)として返す。0→01
   * @param {Number} num
   * @return {String}
   */
  const digitNum = num => {
    return ('0' + num).slice(-2);
  };

  /**
   * 選択された対象をセレクトリストの一番上に表示
   * @param {Number} scroll
   * @param {String} datetype
   */
  const scrollSelected = (scroll, datetype) => {
    // datetypeの値と照らし合わせ、スクロールトップへ設定
    if(datetype === 'hour'){
      this.refs.hourlist.scrollTop = scroll * CELL_HEIGHT;
    }
    if(datetype === 'minute'){
      this.refs.minutelist.scrollTop = scroll * CELL_HEIGHT;
    }
    if(datetype === 'second'){
      this.refs.secondlist.scrollTop = scroll * CELL_HEIGHT;
    }
  };
  // momentオブジェクトを入れる変数を宣言
  let momentObj;
  /**
   * 引数の値がUndefinedであればをそのままmomentオブジェクトへ追加。
   * 引数の値がUndefinedでなければHH:mm:ss.sssへ0を設定。
   * 画面表示をさせるためpartialFormat(this.momentObj)を代入。
   * @param {String} date
   */
  const updateDisplayDate = date => {
    if (!isUndefined(date)) {
      momentObj = moment.utc(date);
      this.displayFormatDate = partialFormat(momentObj);
    } else {
      momentObj = moment.utc().set('hour', 0).set('minute', 0).set('second', 0).set('milliseconds', 0);
      this.displayFormatDate = '';
    }
  };

  updateDisplayDate(this.opts.date);

  this.on('update', () => {
    updateDisplayDate(this.opts.date);
  }).on('updated', () => {
    this.rebindTouchEvents();
    const splitsFormatDate = this.displayFormatDate.split(':', 3);
    if(this.opts.isshown){
      scrollSelected(Number(splitsFormatDate[0]),'hour');
      scrollSelected(Number(splitsFormatDate[1]),'minute');
      scrollSelected(Number(splitsFormatDate[2]),'second');
    }
  });

  /**
   * プルダウンリストの表示
   * 引数の値に応じて表示する内容を変更
   * @param {String} datetype
   */
  this.generateTimes = datetype => {
    let maxDisplayTime;
    // datetypeの値と比較して,対象の繰り返し表示の回数を設定
    if(datetype === 'hour'){
      maxDisplayTime = 24;
    }
    if(datetype === 'minute'){
      maxDisplayTime = 60;
    }
    if(datetype === 'second'){
      maxDisplayTime = 60;
    }
    // 配列arrayTimeを用意
    const arrayTime = [];
    // mout/function/timeを使用し、上記で設定した回数下記の文を繰り返す
    times(maxDisplayTime, i => {
      const date = momentObj.clone().set(datetype,i);
      const displayNum = digitNum(i);
      arrayTime[i] = {
        date,
        displayNum,
        'isSelected': partialFormat(date) === this.displayFormatDate,
        'scroll': i
      };
    });
    return arrayTime;
  };
  /**
   * プルダウンリストのリストをタップした際のイベント
   * @param {Object} date
   */
  this.handleSelectItemTap = date => {
    let isoFormatDate = date.toISOString();
    this.opts.onchange(isoFormatDate);
  };
  // テキストボックスをタップした際のイベント
  this.handleInputTap = () => {
    this.opts.ontoggle(!this.opts.isshown);
  };
}
