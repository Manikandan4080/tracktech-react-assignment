import { Line } from "@/types/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface LinesState {
  lines: Line[]
}

// Helper functions for localStorage
const loadLinesFromStorage = (): Line[] => {
  try {
    const stored = localStorage.getItem('lines')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading lines from localStorage:', error)
    return []
  }
}

const saveLinesToStorage = (lines: Line[]) => {
  try {
    localStorage.setItem('lines', JSON.stringify(lines))
  } catch (error) {
    console.error('Error saving lines to localStorage:', error)
  }
}

const initialState: LinesState = {
  lines: loadLinesFromStorage(),
}

const linesSlice = createSlice({
  name: "lines",
  initialState,
  reducers: {
    addLine: (state, action: PayloadAction<Line>) => {
      state.lines.push(action.payload)
      saveLinesToStorage(state.lines)
    },
    updateLine: (state, action: PayloadAction<Line>) => {
      const index = state.lines.findIndex((line) => line.id === action.payload.id)
      if (index !== -1) {
        state.lines[index] = action.payload
        saveLinesToStorage(state.lines)
      }
    },
    deleteLine: (state, action: PayloadAction<string>) => {
      state.lines = state.lines.filter((line) => line.id !== action.payload)
      saveLinesToStorage(state.lines)
    },
    deleteLinesByUnit: (state, action: PayloadAction<string>) => {
      state.lines = state.lines.filter((line) => line.unitId !== action.payload)
      saveLinesToStorage(state.lines)
    },
    loadLines: (state) => {
      state.lines = loadLinesFromStorage()
    },
  },
})

export const { addLine, updateLine, deleteLine, deleteLinesByUnit, loadLines } = linesSlice.actions
export default linesSlice.reducer