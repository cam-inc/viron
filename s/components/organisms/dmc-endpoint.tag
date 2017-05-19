dmc-endpoint.Endpoint(onClick="{ handleClick }")
  .Endpoint__head
    .Endpoint__avatar
      .Endpoint__thumbnail(style="background-image:url({ opts.thumbnail })")
      div(class="Endpoint__token { !!opts.token ? 'Endpoint__token--active' : '' }")
    .Endpoint__menuButton(onClick="{ handleMenuButtonClick }")
      dmc-icon(type="ellipsis")
  .Endpoint__body
    .Endpoint__tags(if="{ !!opts.tags.length }")
      dmc-tag(label="{ label }" each="{ label in opts.tags }")
    .Endpoint__url { opts.url }
    .Endpoint__name { opts.name }
    .Endpoint__description { opts.description }
    .Endpoint__memo { opts.memo }
  .Endpoint__menus(if="{ isMenuOpened }" onClick="{ handleMenusClick }")
    .Endpoint__menuFrame
      dmc-button(onclick="{ handleEditButtonClick }" label="編集")
      dmc-button(onclick="{ handleRemoveButtonClick }" label="削除")
      dmc-button(onclick="{ handleLogoutButtonClick }" label="ログアウト")

  script.
    import '../atoms/dmc-icon.tag';
    import '../atoms/dmc-button.tag';
    import '../atoms/dmc-tag.tag';

    this.isMenuOpened = false;

    handleClick(e) {
      e.preventUpdate = false;
      this.opts.onentry(this.opts.key);
    }

    handleMenusClick(e) {
      e.stopPropagation();
      this.isMenuOpened = false;
      this.update();
    }

    handleMenuButtonClick(e) {
      e.preventDefault();
      e.stopPropagation();
      this.isMenuOpened = true;
      this.update();
    }

    handleEditButtonClick() {
      this.opts.onedit(this.opts.key);
    }

    handleRemoveButtonClick() {
      this.opts.onremove(this.opts.key);
    }

    handleLogoutButtonClick() {
      this.isMenuOpened = false;
      this.update();
      this.opts.onlogout(this.opts.key);
    }
