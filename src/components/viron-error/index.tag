viron-error.Error
  .Error__icon
    viron-icon-exclamation
  .Error__title { title }
  .Error__message(if="{ !!message }") { message }
  viron-prettyprint(if="{ !!detail }" data="{ detail }")

  script.
    import '../../components/icons/viron-icon-exclamation/index.tag';
    import '../../components/viron-prettyprint/index.tag';
    import script from './index';
    this.external(script);
