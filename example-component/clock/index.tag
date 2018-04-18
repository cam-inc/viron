clock.Clock
  .Clock__display
    .Clock__dial
      img.Clock__hand(src="./img/clock_dial.png").dial
    .Clock__hour
      img.Clock__hand(src="./img/clock_hour.png").hour
    .Clock__minute
      img.Clock__hand(src="./img/clock_minute.png").minute
    .Clock__timeZone 東京の時間

  script.
    import script from './index';
    import '../../src/components/viron-pagination/index.tag';
    this.external(script);
