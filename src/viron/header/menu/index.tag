viron-application-header-menu.Application_Header_Menu
  viron-list(list="{ actions }" size="{ 6 }" onSelect="{ handleActionSelect }")

  script.
    import '../../../components/viron-list/index.tag';
    import script from './index';
    this.external(script);
