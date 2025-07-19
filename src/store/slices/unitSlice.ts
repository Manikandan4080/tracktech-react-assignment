
import { Unit } from "@/types/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UnitsState {
  units: Unit[]
}

// Helper functions for localStorage
const loadUnitsFromStorage = (): Unit[] => {
  try {
    const stored = localStorage.getItem('units')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading units from localStorage:', error)
    return []
  }
}

const saveUnitsToStorage = (units: Unit[]) => {
  try {
    localStorage.setItem('units', JSON.stringify(units))
  } catch (error) {
    console.error('Error saving units to localStorage:', error)
  }
}

const initialState: UnitsState = {
  units: loadUnitsFromStorage(),
}

const unitsSlice = createSlice({
  name: "units",
  initialState,
  reducers: {
    addUnit: (state, action: PayloadAction<Unit>) => {
      state.units.push(action.payload)
      saveUnitsToStorage(state.units)
    },
    updateUnit: (state, action: PayloadAction<Unit>) => {
      const index = state.units.findIndex((unit) => unit.id === action.payload.id)
      if (index !== -1) {
        state.units[index] = action.payload
        saveUnitsToStorage(state.units)
      }
    },
    deleteUnit: (state, action: PayloadAction<string>) => {
      state.units = state.units.filter((unit) => unit.id !== action.payload)
      saveUnitsToStorage(state.units)
    },
    loadUnits: (state) => {
      state.units = loadUnitsFromStorage()
    },
  },
})

export const { addUnit, updateUnit, deleteUnit, loadUnits } = unitsSlice.actions
export default unitsSlice.reducer