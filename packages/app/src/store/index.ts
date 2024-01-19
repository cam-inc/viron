import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
  isLaunched as appIsLaunchedAtom,
  screen as appScreenAtom,
  theme as appThemeAtom,
} from './atoms/app';
import {
  list as endpointListAtom,
  groupList as endpointGroupListAtom,
} from './atoms/endpoint';
import {
  listByGroup as endpointListByGroupSelector,
  listUngrouped as endpointListUngroupedSelector,
  listItem as endpointListItemSelector,
  groupListSorted as endpointGroupListSortedSelector,
  groupListItem as endpointGroupListItemSelector,
} from './selectors/endpoint';

/**
 * Rename recoil functions to make them abstract.
 */
export const GlobalStateProvider = RecoilRoot;
export const useGlobalState = useRecoilState;
export const useGlobalStateValue = useRecoilValue;
export const useGlobalStateSet = useSetRecoilState;

/**
 * Shortcut hooks to help react components use recoil functions.
 * Equivalent to the code snipet below.
 * ```tsx
 * import { useGlobalState } from '$store';
 * import { isLaunched } from '$store/atoms/app';
 * export default () => {
 *  const [isLaunched, setIsLaunched] = useGlobalState(isLaunched);
 * };
 * ```
 */
// App
export const useAppIsLaunchedGlobalState = () =>
  useGlobalState(appIsLaunchedAtom);
export const useAppIsLaunchedGlobalStateValue = () =>
  useGlobalStateValue(appIsLaunchedAtom);
export const useAppIsLaunchedGlobalStateSet = () =>
  useGlobalStateSet(appIsLaunchedAtom);

export const useAppScreenGlobalState = () => useGlobalState(appScreenAtom);
export const useAppScreenGlobalStateValue = () =>
  useGlobalStateValue(appScreenAtom);
export const useAppScreenGlobalStateSet = () =>
  useGlobalStateSet(appScreenAtom);

export const useAppThemeGlobalState = () => useGlobalState(appThemeAtom);
export const useAppThemeGlobalStateValue = () =>
  useGlobalStateValue(appThemeAtom);
export const useAppThemeGlobalStateSet = () => useGlobalStateSet(appThemeAtom);

// Endpoint
export const useEndpointListGlobalState = () =>
  useGlobalState(endpointListAtom);
export const useEndpointListGlobalStateValue = () =>
  useGlobalStateValue(endpointListAtom);
export const useEndpointListGlobalStateSet = () =>
  useGlobalStateSet(endpointListAtom);

export const useEndpointGroupListGlobalState = () =>
  useGlobalState(endpointGroupListAtom);
export const useEndpointGroupListGlobalStateValue = () =>
  useGlobalStateValue(endpointGroupListAtom);
export const useEndpointGroupListGlobalStateSet = () =>
  useGlobalStateSet(endpointGroupListAtom);

export const useEndpointListByGroupGlobalStateValue = () =>
  useGlobalStateValue(endpointListByGroupSelector);

export const useEndpointListUngroupedGlobalStateValue = () =>
  useGlobalStateValue(endpointListUngroupedSelector);

export const useEndpointListItemGlobalState = (
  params: Parameters<typeof endpointListItemSelector>[0]
) => useGlobalState(endpointListItemSelector(params));
export const useEndpointListItemGlobalStateValue = (
  params: Parameters<typeof endpointListItemSelector>[0]
) => useGlobalStateValue(endpointListItemSelector(params));
export const useEndpointListItemGlobalStateSet = (
  params: Parameters<typeof endpointListItemSelector>[0]
) => useGlobalStateSet(endpointListItemSelector(params));

export const useEndpointGroupListSortedGlobalStateValue = () =>
  useGlobalStateValue(endpointGroupListSortedSelector);

export const useEndpointGroupListItemGlobalState = (
  params: Parameters<typeof endpointGroupListItemSelector>[0]
) => useGlobalState(endpointGroupListItemSelector(params));
export const useEndpointGroupListItemGlobalStateValue = (
  params: Parameters<typeof endpointGroupListItemSelector>[0]
) => useGlobalStateValue(endpointGroupListItemSelector(params));
export const useEndpointGroupListItemGlobalStateSet = (
  params: Parameters<typeof endpointGroupListItemSelector>[0]
) => useGlobalStateSet(endpointGroupListItemSelector(params));
