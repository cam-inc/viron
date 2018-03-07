viron-video.Video
  video.Video__content(controls='controls')
    source(src="{ opts.val }" type="video/{ videoType }")

  script.
    import script from './index';
    this.external(script);
