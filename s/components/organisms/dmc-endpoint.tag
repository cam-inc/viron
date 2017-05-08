dmc-endpoint.Endpoint(click="{handleClick}")
  .Endpoint__head
    .Endpoint__thumbnail(style="background-image:url({ opts.thumbnail })")
    .Endpoint__menuButton(click="{handleMenuButtonClick}")
      dmc-icon(type="ellipsis")
  .Endpoint__body
    .Endpoint__tags { (opts.tags || []).join(', ') }
    .Endpoint__host { opts.key }
    .Endpoint__title { opts.title }
    .Endpoint__description { opts.description }

    div(style="margin-top:24px")
      dmc-button(onclick="{ handleEditButtonClick }") 編集
      dmc-button(onclick="{ handleRemoveButtonClick }") 削除

  script.
    import '../atoms/dmc-icon.tag';
    import '../atoms/dmc-button.tag';

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
