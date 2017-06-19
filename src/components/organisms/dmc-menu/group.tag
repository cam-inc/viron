dmc-menu-group.Menu__group
  .Menu__groupToggle(ref="touch" onTap="handleToggleTap")
    dmc-icon(type="codeSquareO" class="Menu__groupIconHead")
    .Menu__groupName { opts.group.isIndependent ? opts.group.list[0].name : opts.group.name }
    dmc-icon(if="{ !opts.group.isIndependent }" type="up" class="Menu__groupIconTail { isOpened ? 'Menu__groupIconTail--opened' : '' }")
  div(if="{ !opts.group.isIndependent }" class="Menu__groupList { isOpened ? 'Menu__groupList--opened' : '' }")
    .Menu__groupListItem(each="{ opts.group.list }" ref="touch" onTap="handleGroupItemTap") { name }

  script.
    import '../../atoms/dmc-icon/index.tag';
    import script from './group';
    this.external(script);
