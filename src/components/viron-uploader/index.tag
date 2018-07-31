viron-uploader.Uploader(class="{ 'Uploader--dragWatching' : isDragWatching, 'Uploader--disabled': opts.isdisabled, 'Uploader--error': opts.haserror }" onChange="{ handleChange }")
  form.Uploader__form(ref="form")
    input.Uploader__input(type="file" id="{ inputId }" accept="{ opts.accept || '*' }" disabled="{ opts.isdisabled }" onChange="{ handleFileChange }")
    label.Uploader__label(for="{ inputId }")
      virtual(if="{ !file && !blobURL }")
        .Uploader__icon
          viron-icon-file-add
      virtual(if="{ !!file || !!blobURL }")
        virtual(if="{ isTypeOfImage || !!blobURL }")
          .Uploader__image(style="background-image:url({ blobURL });")
        virtual(if="{ isTypeOfCsv }")
          .Uploader__icon
            viron-icon-file-csv
        virtual(if="{ isTypeOfOther }")
          .Uploader__icon
            viron-icon-file
      .Uploader__dragHandler(onDragEnter="{ handleHandlerDragEnter }" onDragOver="{ handleHandlerDragOver }" onDragLeave="{ handleHandlerDragLeave }" onDrop="{ handleHandlerDrop }")
  .Uploader__reset(if="{ !!file }" onTap="{ handleResetButtonTap }")
    viron-icon-close
  .Uploader__fileName(if="{ !!fileName }") { fileName }
  .Uploader__blocker(if="{ opts.ispreview }" onTap="{ handleBlockerTap }")

  script.
    import '../../components/icons/viron-icon-close/index.tag';
    import '../../components/icons/viron-icon-file/index.tag';
    import '../../components/icons/viron-icon-file-add/index.tag';
    import '../../components/icons/viron-icon-file-csv/index.tag';
    import script from './index';
    this.external(script);
