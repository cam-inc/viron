module.exports = {
  components: [
    {
      // Required
      // Tag name.
      name: 'my-topic',

      // Required
      // Component style name the custom component is used for.
      style: 'topic',

      // Optional
      // Size of column. `columnSpreadSmall`(default) or `columnSpreadFull`.
      columnSize: 'columnSpreadFull',

      // Optional
      // Size of row. `rowSpreadSmall`(default), `rowSpreadMedium` or `rowSpreadLarge`.
      rowSize: 'rowSpreadLarge',

      // Required
      // Relative path to the riot tag file from your local viron repository root.
      path: './example-component/my-topic/index.tag',

      // Required
      // Relative path to the css file from your local viron repository root.
      css: './example-component/my-topic/index.css'
    },
      {
        // Required
        // Tag name.
        name: 'clock',

        // Required
        // Component style name the custom component is used for.
        style: 'clock',

        // Optional
        // Size of column. `columnSpreadSmall`(default) or `columnSpreadFull`.
        columnSize: 'columnSpreadSmall',

        // Optional
        // Size of row. `rowSpreadSmall`(default), `rowSpreadMedium` or `rowSpreadLarge`.
        rowSize: 'rowSpreadMedium',

        // Required
        // Relative path to the riot tag file from your local viron repository root.
        path: './example-component/clock/index.tag',

        // Required
        // Relative path to the css file from your local viron repository root.
        css: './example-component/clock/index.css'
      }
  ]
};
