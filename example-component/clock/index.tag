clock.Clock
  .Clock__display
    .Clock__dial
      svg.Clock__hand.dial
        image(width="250px" height="250px" xlink:href="./img/clock_dial.svg")
    .Clock__hour
      svg.Clock__hand.hour
        image(width="250px" height="250px" xlink:href="./img/clock_hour.svg")
    .Clock__minute
      svg.Clock__hand.minute
        image(width="250px" height="250px" xlink:href="./img/clock_minute.svg")
    .Clock__timeZone 東京の時間

  script.
    import script from './index';
    import '../../src/components/viron-pagination/index.tag';

    this.external(script);
