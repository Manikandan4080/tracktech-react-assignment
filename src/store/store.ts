import { configureStore } from "@reduxjs/toolkit"
import unitsSlice from "./slices/unitSlice"
import linesSlice from "./slices/lineSlices"
import shiftsSlice from "./slices/shiftSlices"
import ordersSlice from "./slices/orderSlice"

export const store = configureStore({
  reducer: {
    units: unitsSlice,
    lines: linesSlice,
    shifts: shiftsSlice,
    orders: ordersSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
