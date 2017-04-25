dmc-endpoint.Endpoint(click="{handleClick}")
  .Endpoint__head
    .Endpoint__thumbnail
    .Endpoint__menuButton(click="{handleMenuButtonClick}")
      dmc-icon(type="ellipsis")
  .Endpoint__body
    .Endpoint__tags { (opts.tags || []).join(', ') }
    .Endpoint__host { opts.host }
    .Endpoint__title { opts.title }
    .Endpoint__description { opts.description }

    div(style="margin-top:24px")
      div(click="{handleEditButtonClick}")
        | 編集
      div(click="{handleRemoveButtonClick}")
        | 削除

  script.
    import '../atoms/dmc-icon.tag';

    handleClick() {
      this.opts.onentry(this.opts.url);
    }

    handleMenuButtonClick(e) {
      e.preventDefault();
    }

    handleEditButtonClick() {
      this.opts.onedit(this.opts.url);
    }

    handleRemoveButtonClick() {
      this.opts.onremove(this.opts.url);
    }
