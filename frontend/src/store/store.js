import { create } from "zustand";
import { createCartSlice } from "./cartSlice";

export const useBoundStore = create((...a) => ({
    ...createCartSlice(...a),
}));