// import { createAuthSlice } from "./slices/auth-slice";
// import { create } from "zustand";


// export const useAppStore = create()((...a)=>({
//   ...createAuthSlice(...a),
// }))


import { createAuthSlice } from "./slices/auth-slice";
import { create } from "zustand";

export const useAppStore = create((...a) => ({
  ...createAuthSlice(...a),
}));
