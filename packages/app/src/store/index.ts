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
import { list as endpointListAtom } from './atoms/endpoint';

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
