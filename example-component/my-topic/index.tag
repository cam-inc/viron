my-topic.MyTopic
  .MyTopic__head
    .MyTopic__label { opts.def.name }
    .MyTopic__postButton(if="{ !!postOperation }" onTap="{ handlePostButtonTap }") 追加
  .MyTopic__error(if="{ !!error }") { error }
  .MyTopic__list(if="{ !error && topics.length }")
    .MyTopic__item(each="{ topic in topics }")
      .MyTopic__id { topic.id }
      .MyTopic__content { topic.content }
      .MyTopic__putButton(onTap="{ handlePutButtonTap }") 変更
      .MyTopic__deleteButton(onTap="{ handleDeleteButtonTap }") 削除
  .MyTopic__tail(if="{ hasPagination }")
    viron-pagination(max="{ pagination.max }" size="{ paginationSize }" current="{ pagination.current }" onChange="{ handlePaginationChange }")

  script.
    import script from './index';
    import '../../src/components/viron-pagination/index.tag';
    this.external(script);
