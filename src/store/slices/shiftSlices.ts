import { Shift } from "@/types/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ShiftsState {
  shifts: Shift[]
}

// Helper functions for localStorage
const loadShiftsFromStorage = (): Shift[] => {
  try {
    const stored = localStorage.getItem('shifts')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading shifts from localStorage:', error)
    return []
  }
}

const saveShiftsToStorage = (shifts: Shift[]) => {
  try {
    localStorage.setItem('shifts', JSON.stringify(shifts))
  } catch (error) {
    console.error('Error saving shifts to localStorage:', error)
  }
}

const initialState: ShiftsState = {
  shifts: loadShiftsFromStorage(),
}

const shiftsSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    addShift: (state, action: PayloadAction<Shift>) => {
      state.shifts.push(action.payload)
      saveShiftsToStorage(state.shifts)
    },
    updateShift: (state, action: PayloadAction<Shift>) => {
      const index = state.shifts.findIndex((shift) => shift.id === action.payload.id)
      if (index !== -1) {
        state.shifts[index] = action.payload
        saveShiftsToStorage(state.shifts)
      }
    },
    deleteShift: (state, action: PayloadAction<string>) => {
      state.shifts = state.shifts.filter((shift) => shift.id !== action.payload)
      saveShiftsToStorage(state.shifts)
    },
    loadShifts: (state) => {
      state.shifts = loadShiftsFromStorage()
    },
  },
})

export const { addShift, updateShift, deleteShift, loadShifts } = shiftsSlice.actions
export default shiftsSlice.reducer