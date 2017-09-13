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
            .Application__menuItem.Application__menuItem--interactive(ref="touch" onTap="handleEntryMenuItemTap")
              .Application__menuItemIcon
                dmc-icon(type="link")
              .Application__menuItemBody 新規追加
            .Application__menuItem.Application__menuItem--interactive(ref="touch" onTap="handleDownloadMenuItemTap")
              .Application__menuItemIcon
                dmc-icon(type="download")
              .Application__menuItemBody ダウンロード
            label.Application__menuItem.Application__menuItem--interactive(for="Application{_riot_id}")
              .Application__menuItemIcon
                dmc-icon(type="upload")
              .Application__menuItemBody
                | アップロード
                input.Application__menuItemInput(type="file" accept='application/json' id="Application{_riot_id}" onChange="{ handleFileChange }")
            .Application__menuItem.Application__menuItem--interactive(if="{ endpointsCount > 1 }" ref="touch" onTap="handleOrderMenuItemTap")
              .Application__menuItemIcon
                dmc-icon(type="bars")
              .Application__menuItemBody 並び替え
            .Application__menuItem.Application__menuItem--interactive(ref="touch" onTap="handleClearMenuItemTap")
              .Application__menuItemIcon
                dmc-icon(type="close")
              .Application__menuItemBody クリア
            .Application__menuItem.Application__menuItem--secondary
              .Application__menuItemIcon
                dmc-icon(type="search")
              .Application__menuItemBody
                dmc-textinput(text="{ endpointFilterText }" theme="ghost" placeholder="filter..." onChange="{ handleFilterChange }")
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
    import '../components/atoms/dmc-textinput/index.tag';
    import script from './index';
    this.external(script);
