import { ScheduledBlock } from "@/types/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ScheduledBlocksState {
  scheduledBlocks: ScheduledBlock[]
}

const initialState: ScheduledBlocksState = {
  scheduledBlocks: [],
}

const scheduledBlocksSlice = createSlice({
  name: "scheduledBlocks",
  initialState,
  reducers: {
    addScheduledBlock: (state, action: PayloadAction<ScheduledBlock>) => {
      state.scheduledBlocks.push(action.payload)
    },
    addScheduledBlocks: (state, action: PayloadAction<ScheduledBlock[]>) => {
      state.scheduledBlocks = action.payload
    },
    updateScheduledBlocks: (state, action: PayloadAction<ScheduledBlock[]>) => {
      state.scheduledBlocks = action.payload
    },
    moveOrderBlock: (state, action: PayloadAction<{ blockId: string; newLineId: string; newDate: string }>) => {
      const block = state.scheduledBlocks.find((block) => block.blockId === action.payload.blockId)
      if (block) {
        block.lineId = action.payload.newLineId
        block.date = action.payload.newDate
      }
    },
    removeScheduledBlocksByOrderId: (state, action: PayloadAction<string>) => {
      state.scheduledBlocks = state.scheduledBlocks.filter((block) => block.orderId !== action.payload)
    },
    removeScheduledBlock: (state, action: PayloadAction<string>) => {
      state.scheduledBlocks = state.scheduledBlocks.filter((block) => block.blockId !== action.payload)
    },
    clearScheduledBlocks: (state) => {
      state.scheduledBlocks = []
    },
  },
})

export const {
  addScheduledBlock,
  addScheduledBlocks,
  updateScheduledBlocks,
  moveOrderBlock,
  removeScheduledBlocksByOrderId,
  removeScheduledBlock,
  clearScheduledBlocks,
} = scheduledBlocksSlice.actions

export default scheduledBlocksSlice.reducer
