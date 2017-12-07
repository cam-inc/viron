viron-dialog.Dialog
  .Dialog__icon(if="{ !!opts.icon }")
    div(data-is="viron-icon-{ opts.icon }")
  .Dialog__title(if="{ !!opts.title }") { opts.title }
  .Dialog__message(if="{ !!opts.message }") { opts.message }
  .Dialog__control
    viron-button(label="{ opts.labelPositive || 'OK' }" onSelect="{ handlePositiveSelect }")
    viron-button(label="{ opts.labelNegative || 'キャンセル' }" theme="ghost" onSelect="{ handleNegativeSelect }")

  script.
    import '../../components/icons/viron-icon-arrow-down/index.tag';
    import '../../components/icons/viron-icon-arrow-left/index.tag';
    import '../../components/icons/viron-icon-arrow-right/index.tag';
    import '../../components/icons/viron-icon-arrow-up/index.tag';
    import '../../components/icons/viron-icon-check/index.tag';
    import '../../components/icons/viron-icon-close/index.tag';
    import '../../components/icons/viron-icon-dots/index.tag';
    import '../../components/icons/viron-icon-down/index.tag';
    import '../../components/icons/viron-icon-edit/index.tag';
    import '../../components/icons/viron-icon-exclamation-circle/index.tag';
    import '../../components/icons/viron-icon-filter/index.tag';
    import '../../components/icons/viron-icon-logo/index.tag';
    import '../../components/icons/viron-icon-menu/index.tag';
    import '../../components/icons/viron-icon-menu-invert/index.tag';
    import '../../components/icons/viron-icon-move/index.tag';
    import '../../components/icons/viron-icon-plus/index.tag';
    import '../../components/icons/viron-icon-plus-circle/index.tag';
    import '../../components/icons/viron-icon-reload/index.tag';
    import '../../components/icons/viron-icon-search/index.tag';
    import '../../components/icons/viron-icon-setting/index.tag';
    import '../../components/icons/viron-icon-square/index.tag';
    import '../../components/icons/viron-icon-star/index.tag';
    import '../../components/icons/viron-icon-up/index.tag';
    import '../../components/viron-button/index.tag';
    import script from './index';
    this.external(script);
