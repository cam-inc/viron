dmc-endpoint.Endpoint(click="{ handleClick }")
  .Endpoint__head
    .Endpoint__avatar
      .Endpoint__thumbnail(style="background-image:url({ opts.thumbnail })")
      div(class="Endpoint__token { !!opts.token ? 'Endpoint__token--active' : '' }")
    .Endpoint__menuButton(click="{ handleMenuButtonClick }")
      dmc-icon(type="ellipsis")
  .Endpoint__body
    .Endpoint__tags(if="{ !!opts.tags.length }")
      dmc-tag(label="{ label }" each="{ label in opts.tags }")
    .Endpoint__url { opts.url }
    .Endpoint__name { opts.name }
    .Endpoint__description { opts.description }
    .Endpoint__memo { opts.memo }
    .Endpoint__controls
      dmc-button(onclick="{ handleEditButtonClick }" label="編集")
      dmc-button(onclick="{ handleRemoveButtonClick }" label="削除")

  script.
    import '../atoms/dmc-icon.tag';
    import '../atoms/dmc-button.tag';
    import '../atoms/dmc-tag.tag';

    handleClick() {
      this.opts.onentry(this.opts.key);
    }

    handleMenuButtonClick(e) {
      e.preventDefault();
    }

    handleEditButtonClick() {
      this.opts.onedit(this.opts.key);
    }

    handleRemoveButtonClick() {
      this.opts.onremove(this.opts.key);
    }
