viron-application-header-info.Application_Header_Info
  .Application_Header_Info__name { name }
  .Application_Header_Info__urlWrapper
    .Application_Header_Info__color(class="Application_Header_Info__color--{ color || 'blue' }")
    .Application_Header_Info__url { url }
  .Application_Header_Info__description(if="{ description }") { description }
  .Application_Header_Info__tags(if="{ _tags && !!_tags.length }")
    viron-tag(each="{ tag in _tags }" label="{ tag }")

  script.
    import '../../../components/viron-tag/index.tag';
    import script from './index';
    this.external(script);
