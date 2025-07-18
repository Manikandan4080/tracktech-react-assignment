import { Shift } from "@/types/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ShiftsState {
  shifts: Shift[]
}

const initialState: ShiftsState = {
  shifts: [],
}

const shiftsSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    addShift: (state, action: PayloadAction<Shift>) => {
      state.shifts.push(action.payload)
    },
    updateShift: (state, action: PayloadAction<Shift>) => {
      const index = state.shifts.findIndex((shift) => shift.id === action.payload.id)
      if (index !== -1) {
        state.shifts[index] = action.payload
      }
    },
    deleteShift: (state, action: PayloadAction<string>) => {
      state.shifts = state.shifts.filter((shift) => shift.id !== action.payload)
    },
  },
})

export const { addShift, updateShift, deleteShift } = shiftsSlice.actions
export default shiftsSlice.reducer
