dmc-page
  .dmc-page
    | loading.....

  script.
    this.on('unmount', () => {
      const me = this;
      // TODO: debug用なので後で消すこと。
      console.log(me);
    });
