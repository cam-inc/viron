clock.Clock
  .Clock__display
  .clock_data {month}月{date}日{hour}時{min}分{second}秒
    .Clock__dial
      img.Clock__hand(riot-src="{ getWatchDial }").dial
    .Clock__hour
      img.Clock__hand(riot-src="{ getWatchHour }").hour
    .Clock__minute
      img.Clock__hand(riot-src="{ getWatchMinute }").minute
    .Clock__second
      img.Clock__hand(riot-src="{ getWatchSecond }").second

  script.
    import script from './index';
    import '../../src/components/viron-pagination/index.tag';
    this.external(script);
