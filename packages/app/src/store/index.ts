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
export const useAppIsLaunchedGlobalState = function () {
  return useGlobalState(appIsLaunchedAtom);
};
export const useAppIsLaunchedGlobalStateValue = function () {
  return useGlobalStateValue(appIsLaunchedAtom);
};
export const useAppIsLaunchedGlobalStateSet = function () {
  return useGlobalStateSet(appIsLaunchedAtom);
};

export const useAppScreenGlobalState = function () {
  return useGlobalState(appScreenAtom);
};
export const useAppScreenGlobalStateValue = function () {
  return useGlobalStateValue(appScreenAtom);
};
export const useAppScreenGlobalStateSet = function () {
  return useGlobalStateSet(appScreenAtom);
};

export const useAppThemeGlobalState = function () {
  return useGlobalState(appThemeAtom);
};
export const useAppThemeGlobalStateValue = function () {
  return useGlobalStateValue(appThemeAtom);
};
export const useAppThemeGlobalStateSet = function () {
  return useGlobalStateSet(appThemeAtom);
};

// Endpoint
export const useEndpointListGlobalState = function () {
  return useGlobalState(endpointListAtom);
};
export const useEndpointListGlobalStateValue = function () {
  return useGlobalStateValue(endpointListAtom);
};
export const useEndpointListGlobalStateSet = function () {
  return useGlobalStateSet(endpointListAtom);
};
