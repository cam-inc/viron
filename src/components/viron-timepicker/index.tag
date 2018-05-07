viron-timepicker.Timepicker
  .Timepicker__debug { date_time }
  .Timepicker__content
    .Timepicker__contentLeft
      .Timepicker__calendar
        .Timepicker__calendarHead
          .Timepicker__calendarPrev(onTap="{ handleCalendarPrevTap }")
            viron-icon-arrow-left
          .Timepicker__calendarYearMonth { c_year } / { c_month }
          .Timepicker__calendarNext(onTap="{ handleCalendarNextTap }")
            viron-icon-arrow-right
        .Timepicker__calendarWeek
          .Timepicker__calendarWeekDay(each="{ item in c_week }") { item }
        .Timepicker__calendarDates
          .Timepicker__calendarDate(each="{ item in c_dates }" class="{ 'Timepicker__calendarDate--blur': item.isPrev || item.isNext }" onTap="{ handleCalendarDateTap }") { item.num }
    .Timepicker__contentRight
      .Timepicker__hmst
        .Timepicker__hmstList
          .Timepicker__hmstItem(each="{ item in hours }" onTap="{ handleHourTap }") { item }
        .Timepicker__hmstList
          .Timepicker__hmstItem(each="{ item in minutes }" onTap="{ handleMinuteTap }") { item }
        .Timepicker__hmstList
          .Timepicker__hmstItem(each="{ item in seconds }" onTap="{ handleSecondTap }") { item }
        .Timepicker__hmstList
          .Timepicker__hmstItem(each="{ item in offsets }" onTap="{ handleOffsetTap }") { item }

  script.
    import '../../components/icons/viron-icon-arrow-left/index.tag';
    import '../../components/icons/viron-icon-arrow-right/index.tag';
    import script from './index';
    this.external(script);
