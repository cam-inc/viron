dmc-samplerouter
  dmc-route(path="/samplepageA")
    dmc-samplepageA
  dmc-route(path="/samplepageB")
    dmc-samplepageB
  dmc-route(path="/samplepageC/:paramOne/:paramTwo")
    dmc-samplepageC

  script.
    import './dmc-route.tag';
    import './dmc-samplepageA.tag';
    import './dmc-samplepageB.tag';
    import './dmc-samplepageC.tag';
