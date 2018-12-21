viron-endpoints-page-add.EndpointsPage_Add(onTap="{ handleTap }")
  .EndpointsPage_Add__content
    .EndpointsPage_Add__icon
      viron-icon-plus
    .EndpointsPage_Add__label { i18n('endpoint_add') }

  script.
    import '../../../components/icons/viron-icon-plus/index.tag';
    import script from './index';
    this.external(script);
