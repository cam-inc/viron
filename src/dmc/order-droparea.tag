dmc-application-order-droparea.Application__orderDroparea(class="{ 'Application__orderDroparea--watching' : isWatching, 'Application__orderDroparea--droppable' : isDroppable }")
  .Application__orderDropareaContent
  .Application__orderDropareaHandler(onDragEnter="{ handleDragEnter }" onDragOver="{ handleDragOver }" onDragLeave="{ handleDragLeave }" onDrop="{ handleDrop }")

  script.
    import script from './order-droparea';
    this.external(script);
