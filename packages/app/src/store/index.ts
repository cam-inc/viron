// This file is no used bacause of the problem that with the ideal approach below TS Type are not properly distrubuted.
// [Ideal Approach]
// import { useState } from '$store';
// const Component = () => {
//   const [isLaunched, setIsLaunched] = useState(isLaunchedStoreState);
//   return (
//     <p>something</p>
//   );
// };
// So instead, we use the state management like this.
// import { useRecoilState } from 'recoil';
// const Component = () => {
//   const [isLaunched, setIsLaunched] = useRecoilState(isLaunchedStoreState);
//   return (
//     <p>something</p>
//   );
// };

import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';

export const Provider = RecoilRoot;
export const useState = useRecoilState;
export const useValue = useRecoilValue;
