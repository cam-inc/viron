viron-uploader.Uploader(class="{ 'Uploader--dragWatching' : isDragWatching, 'Uploader--disabled': opts.isdisabled, 'Uploader--error': opts.haserror }" onChange="{ handleChange }")
  form.Uploader__form(ref="form")
    input.Uploader__input(type="file" id="{ inputId }" accept="{ opts.accept || 'image/*' }" disabled="{ opts.isdisabled }" onChange="{ handleFileChange }")
    label.Uploader__label(for="{ inputId }")
      .Uploader__empty(if="{ !file || !blobURL }")
        viron-icon-square
      .Uploader__cover(if="{ !!file && !!blobURL && isTypeOfImage }" style="background-image:url({ blobURL });")
      .Uploader__dragHandler(onDragEnter="{ handleHandlerDragEnter }" onDragOver="{ handleHandlerDragOver }" onDragLeave="{ handleHandlerDragLeave }" onDrop="{ handleHandlerDrop }")
  .Uploader__reset(if="{ !!file }" onTap="{ handleResetButtonTap }")
    viron-icon-close
  .Uploader__fileName(if="{ !!fileName }") { fileName }

  script.
    import '../../components/icons/viron-icon-close/index.tag';
    import '../../components/icons/viron-icon-square/index.tag';
    import script from './index';
    this.external(script);
