# @viron/app

## 2.16.0

### Minor Changes

- 6882c978: Design a new sign-in flow in preparation for the upcoming deprecation of third-party cookies.
- 5382259a: Display errors in descendant operations

## 2.15.0

### Minor Changes

- Added OpenId Connect to app, viron/lib(nodejs) and example(nodejs).

### Patch Changes

- de428228: Add a mode prop to AuthConfig to determine how to opening the OAuth endpoint.

## 2.14.0

### Minor Changes

- feat(app): Display details in error modal when api communication fails

## 2.13.2

### Patch Changes

- 125e0090: Fixed to randomly generate fileReader id to avoid duplication.

## 2.13.1

### Patch Changes

- ea7376ce: group dnd bug fixes and refactoring

## 2.13.0

### Minor Changes

- d97e721a: implement DnD for each group

## 2.12.0

### Minor Changes

- 432e1773: retains group toggle open status
- c4320f59: ability to modify endpoints

### Patch Changes

- a61140ed: Fixed missing localization on Groups page

## 2.11.5

### Patch Changes

- 3c66431c: align the label inside the button to the left
- 1d4039dc: align the label inside the button to the left
- 9d73d6a5: fixed localization leaks
- e7ec4bef: add padding to input form

## 2.11.4

### Patch Changes

- 4204d2d2: Move spinner to the center to natural position.
- 77798b09: Hide broken x-thumbnail if error was thrown.

## 2.11.3

### Patch Changes

- 8cf4cc5f: Place a spinner to reduces strange rattling.
- d10ff970: The borders of the content container are completely clipped.

## 2.11.2

### Patch Changes

- 9dadda7e: Fixed to randomly generate autocompleteId to avoid duplication.

## 2.11.1

### Patch Changes

- 0c7dc666: Added `uri` data type to Content Table
- 6bec5dd7: add stopPropagation to sticky td tag

## 2.11.0

### Minor Changes

- 4ee6af83: added single display

### Patch Changes

- 44ddd2d5: update pending dashboard item

## 2.10.0

### Minor Changes

- 91492fc4: Enabled to sort endpoint list

## 2.9.0

### Minor Changes

- d6b10fb4: Move dashbotd tabs to navigation bar.

### Patch Changes

- ff48cdc2: Fixed a bug in sort.

## 2.8.0

### Minor Changes

- 7b319ade: split layout view

## 2.7.0

### Minor Changes

- 89d500f7: Update add endpoint modal design

### Patch Changes

- 96908ed7: update table design
- 5500b377: Fix typo
- 257ef59e: No endpoinits display.
- 723420e5: Fix endpoints empty display
- d9f2cf55: Fix button style and refactor.

## 2.6.1

### Patch Changes

- 4669657f: update endpoints title design
- feb1427a: Change color tone.

## 2.6.0

### Minor Changes

- 498c4912: - Update: add file tree

### Patch Changes

- b1b7d901: Change Root & Dashboard styles

## 2.5.0

### Minor Changes

- adf683f4: Move import & export endpoints button to menu

### Patch Changes

- 184c3c33: - Fix: Pinned panels overlapping sidebars
  - Fix: Scrolling overlaps breadcrumbs UI and Table

## 2.4.1

### Patch Changes

- 31dc9552: update design
- b55e9ddd: Fix dashboard styles

## 2.4.0

### Minor Changes

- 11e3d680: Add Language switcher
- bc50ad64: Add redirect function so that oauth redirect works.

### Patch Changes

- 8a593073: Renewed Head component and AddEndpointButton component on dashboard/groups page.
- f8b0d18b: I changed to use npm-ci on CI.
  Because npm-ci installs modules according to package-lock.json.
- 461920c9: update dashboard desgin
- 350b5aed: Added changes to components due to changes to OutlineButton.
- a683c738: Enlarged navigation icon.
  Added OutlineTwitter icon.
- 81df1448: Renewed appBar button.
  Added "download" and "upload" icons.
- 8e849501: Replaced AddEndpointButton from FilledButton to OutlineButton.
  OutlineButton's outline color was not &{cs}-low, so the color was changed.
- 233f9547: Renewed design of Head component on dashboard page.
- 2c7e3425: update navigation design
- 86f2d9ed: Update Gatsby version specified in Package.json
- 1487e40d: update endpoints page design
- 2cb15ddf: Renewed internalPages of navigation component.
  Changed font size to 14px and changed icon size setting accordingly.
- 6eb3c59d: Renewed the design of the Tabs component on the dashboard page.
- c48eba1c: Enlarged navigation icon.
  Added OutlineTwitter icon.
- Updated dependencies [f8b0d18b]
  - @viron/linter@0.0.2

## 2.3.1

### Patch Changes

- dbc6c331: Temporarily hide the language switch button.
  Switching languages may cause problems.

## 2.3.0

### Minor Changes

- 24511853: Japanese localization support for top page.
- c155e3a8: I18n support for dashboard.
- 4e0c764a: Implementation of language selector.

### Patch Changes

- d02c51af: Updated Gatsby version to v5 from v4
- b6382c10: Remove unnecessary volta version specification.

## 2.2.0

### Minor Changes

- a4a59e4a: Show a popover UI for each table field name.

### Patch Changes

- fe40ce49: Fix allOf handling.

## 2.1.1

### Patch Changes

- c1889658: bug fixes for modals of endpoint and group addition

## 2.1.0

### Minor Changes

- 18a8a9cc: Added JSON Schema format of `uri-image` to display string data with the img tag.
- 536466bb: Put together all sibling and descendant operations.

### Patch Changes

- 354de992: Layout fix for the home page.

## 2.0.4

### Patch Changes

- 1fa1d63d: README.md fixed.

## 2.0.3

### Patch Changes

- c677b970: fix: sibling action extraction
