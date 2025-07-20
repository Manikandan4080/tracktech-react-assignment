import { Unit } from "@/types/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UnitsState {
  units: Unit[]
}

const initialState: UnitsState = {
  units: [],
}

const unitsSlice = createSlice({
  name: "units",
  initialState,
  reducers: {
    addUnit: (state, action: PayloadAction<Unit>) => {
      state.units.push(action.payload)
    },
    updateUnit: (state, action: PayloadAction<Unit>) => {
      const index = state.units.findIndex((unit) => unit.id === action.payload.id)
      if (index !== -1) {
        state.units[index] = action.payload
      }
    },
    deleteUnit: (state, action: PayloadAction<string>) => {
      state.units = state.units.filter((unit) => unit.id !== action.payload)
    },
    setUnits: (state, action: PayloadAction<Unit[]>) => {
      state.units = action.payload
    },
  },
})

export const { addUnit, updateUnit, deleteUnit, setUnits } = unitsSlice.actions
export default unitsSlice.reducer
