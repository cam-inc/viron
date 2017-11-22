viron-parameters-schema.Parameters_Schema(class="{ 'Parameters_Schema--multi': isMulti }")

  virtual(if="{ isFormMode }")
    viron-parameters-form(formData="{ getFormData() }" identifier="{ getFormData().name }" val="{ opts.val }" onChange="{ handleFormChange }")

  virtual(if="{ isSchemaMode }")
    .Parameters_Schema__head
      .Parameters_Schema__title { title }
    .Parameters_Schema__body
      viron-parameters-schema(each="{ property, key in schemaObject.properties }" no-reorder propKey="{ key }" name="{ key }" identifier="{ key }" val="{ parent.getPropertyValue(key) }" required="{ parent.isPropertyRequired(key) }" schemaObject="{ property }" onChange="{ parent.handlePropertyChange }")

  virtual(if="{ isItemsMode }")
    .Parameters_Schema__head
      .Parameters_Schema__title { title }
      viron-icon-plus.Parameters_Schema__plus(onTap="{ handlePlusButtonTap }")
    .Parameters_Schema__body
      virtual(if="{ !(!!opts.val && !!opts.val.length) }")
        div まだ要素がありません(TODO: 消してOK)
      virtual(if="{ !!opts.val && !!opts.val.length }")
        // itemsの要素タイプがobjectでもarrayでも無い場合
        virtual(if="{ isItemsType('form') }")
          viron-parameters-form(each="{ val, idx in opts.val }" no-reorder propKey="{ idx }" formData="{ parent.getItemsObject() }" identifier="{ idx }" val="{ val }" onChange="{ handleItemChange }")
        // itemsの要素タイプがobjectの場合
        virtual(if="{ isItemsType('schema') }")
          viron-parameters-schema(each="{ val, idx in opts.val }" no-reorder propKey="{ idx }" name="{ parent.getItemName(idx) }" identifier="{ idx }" val="{ val }" schemaObject="{ parent.getItemsObject() }" onChange="{ parent.handleItemChange }")
        // itemsの要素タイプがobjectの場合
        virtual(if="{ isItemsType('items') }")
          viron-parameters-schema(each="{ val, idx in opts.val }" no-reorder propKey="{ idx }" name="{ parent.getItemName(idx) }" identifier="{ idx }" val="{ val }" schemaObject="{ parent.getItemsObject() }" onChange="{ parent.handleItemChange }")

  script.
    import '../../../components/icons/viron-icon-plus/index.tag';
    import '../form/index.tag';
    import script from './index';
    this.external(script);
