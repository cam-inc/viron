dmc-endpoint.Endpoint
  | tetete
  .Endpoint__name { opts.name }
  .Endpoint__host { opts.host }
  .Endpoint__description { opts.description }
  div(click="{handleEntryButtonClick}")
    | 入場
  div(click="{handleEditButtonClick}")
    | 編集
  div(click="{handleRemoveButtonClick}")
    | 削除

  script.
    import '../atoms/dmc-icon.tag';

    handleEntryButtonClick() {
      this.opts.onentry(this.opts.url);
    }

    handleEditButtonClick() {
      this.opts.onedit(this.opts.url);
    }

    handleRemoveButtonClick() {
      this.opts.onremove(this.opts.url);
    }
