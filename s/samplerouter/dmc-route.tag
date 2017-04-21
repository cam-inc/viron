dmc-route
  virtual(if="{isVisible}")
    yield.

  script.
    import router from './router';

    this.isRoute = true;
    this.isVisible = false;
    this.routeInfo = {};

    // listen to the route change event.
    router.on(
      opts.path,
      routeInfo => {
        this.isVisible = true;
        this.routeInfo = routeInfo;
        this.update();
      },
      () => {
        this.isVisible = false;
        this.update();
      }
    );
