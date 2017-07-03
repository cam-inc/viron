dmc-uploader.Uploader
  form.Uploader__form(ref="form")
    input.Uploader__input(type="file" id="{ inputId }" accept="{ opts.accept || 'image/*' }" onChange="{ handleFileChange }")
    label.Uploader__label(for="{ inputId }")
      .Uploader__empty(if="{ !file || !blobURL }")
        dmc-icon(type="file")
      .Uploader__cover(if="{ !!file && !!blobURL }" style="background-image:url({ blobURL });")
  .Uploader__reset(if="{ !!file }" ref="touch" onTap="handleResetButtonTap")
    dmc-icon(type="close")
  script.
    import '../../atoms/dmc-icon/index.tag';
    import script from './index';
    this.external(script);
