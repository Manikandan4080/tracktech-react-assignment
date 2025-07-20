import { Line } from "@/types/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface LinesState {
  lines: Line[]
}

const initialState: LinesState = {
  lines: [
    { id: "1", name: "Line A", unitId: "1", dailyCapacity: 1000 },
    { id: "2", name: "Line B", unitId: "1", dailyCapacity: 800 },
    { id: "3", name: "Line C", unitId: "2", dailyCapacity: 1200 },
  ],
}

const linesSlice = createSlice({
  name: "lines",
  initialState,
  reducers: {
    addLine: (state, action: PayloadAction<Line>) => {
      state.lines.push(action.payload)
    },
    updateLine: (state, action: PayloadAction<Line>) => {
      const index = state.lines.findIndex((line) => line.id === action.payload.id)
      if (index !== -1) {
        state.lines[index] = action.payload
      }
    },
    deleteLine: (state, action: PayloadAction<string>) => {
      state.lines = state.lines.filter((line) => line.id !== action.payload)
    },
    setLines: (state, action: PayloadAction<Line[]>) => {
      state.lines = action.payload
    },
  },
})

export const { addLine, updateLine, deleteLine, setLines } = linesSlice.actions
export default linesSlice.reducer
