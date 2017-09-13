viron.Application
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
                viron-icon(type="link")
              .Application__menuItemBody 新規追加
            .Application__menuItem.Application__menuItem--interactive(ref="touch" onTap="handleDownloadMenuItemTap")
              .Application__menuItemIcon
                viron-icon(type="download")
              .Application__menuItemBody ダウンロード
            label.Application__menuItem.Application__menuItem--interactive(for="Application{_riot_id}")
              .Application__menuItemIcon
                viron-icon(type="upload")
              .Application__menuItemBody
                | アップロード
                input.Application__menuItemInput(type="file" accept='application/json' id="Application{_riot_id}" onChange="{ handleFileChange }")
            .Application__menuItem.Application__menuItem--interactive(if="{ endpointsCount > 1 }" ref="touch" onTap="handleOrderMenuItemTap")
              .Application__menuItemIcon
                viron-icon(type="bars")
              .Application__menuItemBody 並び替え
            .Application__menuItem.Application__menuItem--interactive(ref="touch" onTap="handleClearMenuItemTap")
              .Application__menuItemIcon
                viron-icon(type="close")
              .Application__menuItemBody クリア
            .Application__menuItem.Application__menuItem--secondary
              .Application__menuItemIcon
                viron-icon(type="search")
              .Application__menuItemBody
                viron-textinput(text="{ endpointFilterText }" theme="ghost" placeholder="filter..." onChange="{ handleFilterChange }")
      virtual(if="{ !isTopPage }")
        viron-menu
    .Application__mainColumn
      .Application__page
        div(data-is="viron-{ pageName }" route="{ pageRoute }")
  viron-drawers
  viron-modals
  viron-toasts
  viron-progress(if="{ isNetworking }")
  viron-blocker(if="{ isNavigating }")
  viron-splash(if="{ !isLaunched }")

  script.
    import '../components/pages/viron-components/index.tag';
    import '../components/pages/viron-endpoints/index.tag';
    import '../components/pages/viron-notfound/index.tag';
    import '../components/organisms/viron-blocker/index.tag';
    import '../components/organisms/viron-drawers/index.tag';
    import '../components/organisms/viron-menu/index.tag';
    import '../components/organisms/viron-modals/index.tag';
    import '../components/organisms/viron-progress/index.tag';
    import '../components/organisms/viron-splash/index.tag';
    import '../components/organisms/viron-toasts/index.tag';
    import '../components/atoms/viron-textinput/index.tag';
    import script from './index';
    this.external(script);
