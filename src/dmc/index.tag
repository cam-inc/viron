dmc.Application
  .Application__contents
    .Application__asideColumn
      virtual(if="{ isTopPage }")
        .Application__menu
          .Application__title
            | Design based
            br
            | Management
            br
            | Console
          .Application__menuItems
            .Application__menuItem(ref="touch" onTap="handleEntryMenuItemTap")
              .Application__menuItemIcon
                dmc-icon(type="link")
              .Application__menuItemLabel 新規追加
            .Application__menuItem(ref="touch" onTap="handleDownloadMenuItemTap")
              .Application__menuItemIcon
                dmc-icon(type="download")
              .Application__menuItemLabel ダウンロード
            label.Application__menuItem(for="Application{_riot_id}")
              .Application__menuItemIcon
                dmc-icon(type="upload")
              .Application__menuItemLabel アップロード
              input.Application__menuItemInput(type="file" accept='application/json' id="Application{_riot_id}" onChange="{ handleFileChange }")
            .Application__menuItem(if="{ endpointsCount > 2 }" ref="touch" onTap="handleOrderMenuItemTap")
              .Application__menuItemIcon
                dmc-icon(type="bars")
              .Application__menuItemLabel 並び替え
            .Application__menuItem(ref="touch" onTap="handleClearMenuItemTap")
              .Application__menuItemIcon
                dmc-icon(type="close")
              .Application__menuItemLabel クリア
      virtual(if="{ !isTopPage }")
        dmc-menu
    .Application__mainColumn
      .Application__page
        div(data-is="dmc-{ pageName }" route="{ pageRoute }")
  dmc-drawers
  dmc-modals
  dmc-toasts
  dmc-progress(if="{ isNetworking }")
  dmc-blocker(if="{ isNavigating }")
  dmc-splash(if="{ !isLaunched }")

  script.
    import '../components/pages/dmc-components/index.tag';
    import '../components/pages/dmc-endpoints/index.tag';
    import '../components/pages/dmc-notfound/index.tag';
    import '../components/organisms/dmc-blocker/index.tag';
    import '../components/organisms/dmc-drawers/index.tag';
    import '../components/organisms/dmc-menu/index.tag';
    import '../components/organisms/dmc-modals/index.tag';
    import '../components/organisms/dmc-progress/index.tag';
    import '../components/organisms/dmc-splash/index.tag';
    import '../components/organisms/dmc-toasts/index.tag';
    import script from './index';
    this.external(script);
