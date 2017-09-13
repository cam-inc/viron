viron-uploader.Uploader(class="{ 'Uploader--disabled' : opts.isdisabled, 'Uploader--dragWatching' : isDragWatching }" onChange="{ handleChange }")
  form.Uploader__form(ref="form")
    input.Uploader__input(type="file" id="{ inputId }" accept="{ opts.accept || 'image/*' }" disabled="{ !!opts.isdisabled }" onChange="{ handleFileChange }")
    label.Uploader__label(for="{ inputId }")
      .Uploader__empty(if="{ !file || !blobURL }")
        viron-icon(type="file")
      .Uploader__cover(if="{ !!file && !!blobURL && isTypeOfImage }" style="background-image:url({ blobURL });")
      .Uploader__dragHandler(onDragEnter="{ handleHandlerDragEnter }" onDragOver="{ handleHandlerDragOver }" onDragLeave="{ handleHandlerDragLeave }" onDrop="{ handleHandlerDrop }")
  .Uploader__reset(if="{ !!file }" ref="touch" onTap="handleResetButtonTap")
    viron-icon(type="close")
  .Uploader__fileName(if="{ !!fileName }") { fileName }
  script.
    import '../../atoms/viron-icon/index.tag';
    import script from './index';
    this.external(script);
