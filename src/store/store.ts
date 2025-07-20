import { configureStore } from "@reduxjs/toolkit"
import unitsReducer from "./slices/unitSlice"
import linesReducer from "./slices/lineSlices"
import shiftsReducer from "./slices/shiftSlices"
import ordersReducer from "./slices/orderSlice"
import scheduledBlocksReducer from "./slices/scheduleBlockSlice"

export const store = configureStore({
  reducer: {
    units: unitsReducer,
    lines: linesReducer,
    shifts: shiftsReducer,
    orders: ordersReducer,
    scheduledBlocks: scheduledBlocksReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
