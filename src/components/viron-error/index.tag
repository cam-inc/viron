viron-error.Error
  .Error__title { title }
  .Error__message(if="{ !!message }") { message }
  viron-prettyprint(if="{ !!detail }" data="{ detail }")

  script.
    import '../../components/viron-prettyprint/index.tag';
    import script from './index';
    this.external(script);
