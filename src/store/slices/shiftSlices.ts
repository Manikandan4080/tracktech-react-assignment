import { Shift } from "@/types/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ShiftsState {
  shifts: Shift[]
}

const initialState: ShiftsState = {
  shifts: [
    { id: "1", name: "Morning Shift", startTime: "08:00", endTime: "16:00" },
    { id: "2", name: "Evening Shift", startTime: "16:00", endTime: "00:00" },
    { id: "3", name: "Night Shift", startTime: "00:00", endTime: "08:00" },
  ],
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
    setShifts: (state, action: PayloadAction<Shift[]>) => {
      state.shifts = action.payload
    },
  },
})

export const { addShift, updateShift, deleteShift, setShifts } = shiftsSlice.actions
export default shiftsSlice.reducer
