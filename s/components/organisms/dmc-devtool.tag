dmc-devtool
  div(style="margin-bottom:10px;") TODO: デバッグ目的のview。不要になったら消すこと。


  dmc-button(onclick="{ handleResetCurrentButtonClick }" label="Storage->Current リセット")
  dmc-button(onclick="{ handleResetEndpointsButtonClick }" label="Storage->Endpoint リセット")

  br
  br

  dmc-button(click="{ handleShowToastButtonClick}" label="Show Toast")
  dmc-button(onclick="{ handleTooltipToggleButtonClick }" label="Tooltipトグル")
  dmc-tooltip(if="{ isTooltipVisible }" message="message here...")

  script.
    import constants from '../../core/constants';
    import '../atoms/dmc-button.tag';
    import '../atoms/dmc-tooltip.tag';

    const store = this.riotx.get();

    this.isTooltipVisible = false;

    handleResetCurrentButtonClick() {
      store.action(constants.ACTION_CURRENT_REMOVE);
    };

    handleResetEndpointsButtonClick() {
      store.action(constants.ACTION_ENDPOINTS_REMOVE_ALL);
    }

    handleShowToastButtonClick() {
      store.action(constants.ACTION_TOAST_SHOW, {
        message : 'devtools - toast test',
        autoHide: false,
        type: 'error',
        link: 'https://google.com',
        linkText: 'linklink'
      });
    }

    handleTooltipToggleButtonClick() {
      this.isTooltipVisible = !this.isTooltipVisible;
      this.update();
    }
