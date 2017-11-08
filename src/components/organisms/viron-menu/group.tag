viron-menu-group.Menu__group
  .Menu__groupToggle(class="{ opts.group.isIndependent && opts.group.list[0].isSelected ? 'Menu__groupToggle--selected' : '' }" onClick="{ handleToggleClick }")
    viron-icon(type="play" class="Menu__groupIconHead")
    .Menu__groupName { opts.group.isIndependent ? opts.group.list[0].name : opts.group.name }
    viron-icon(if="{ !opts.group.isIndependent }" type="up" class="Menu__groupIconTail { isOpened ? 'Menu__groupIconTail--opened' : '' }")
  div(if="{ !opts.group.isIndependent }" class="Menu__groupList { isOpened ? 'Menu__groupList--opened' : '' }")
    .Menu__groupListItem(each="{ item, idx in opts.group.list }" class="{ item.isSelected ? 'Menu__groupListItem--selected' : ''}" data-idx="{ idx }" onClick="{ handleGroupItemClick }") { item.name }

  script.
    import '../../atoms/viron-icon/index.tag';
    import script from './group';
    this.external(script);
