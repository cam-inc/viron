my-topic.MyTopic
  .MyTopic__label { opts.def.name }
  .MyTopic__postButton(if="{ !!postOperation }" onTap="{ handlePostButtonTap }") POST
  .MyTopic__error(if="{ !!error }") { error }
  .MyTopic__list(if="{ !error && topics.length }")
    .MyTopic__item(each="{ topic in topics }") { topic.content }

  script.
    import script from './index';
    this.external(script);
