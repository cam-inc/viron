dmc-devtool
  div(style="margin-bottom:10px;") TODO: デバッグ目的のview。不要になったら消すこと。
  dmc-button(click="{ handleResetCurrentButtonClick}") Storage->Current リセット
  dmc-button(click="{ handleResetEndpointsButtonClick}") Storage->Endpoint リセット
  br
  br
  dmc-button(click="{ handleShowToastButtonClick}") Show Toast

  script.
    import constants from '../../core/constants';
    import '../atoms/dmc-button.tag';

    const store = this.riotx.get();

    handleResetCurrentButtonClick() {
      store.action(constants.ACTION_CURRENT_REMOVE);
    };

    handleResetEndpointsButtonClick() {
      store.action(constants.ACTION_ENDPOINT_REMOVE_ALL);
    }

    handleShowToastButtonClick() {
      store.action(constants.ACTION_TOAST_SHOW, {
        message : 'devtools - toast test'
      })
    }
