import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../store"

// Basic selectors
export const selectUnits = (state: RootState) => state.units.units
export const selectLines = (state: RootState) => state.lines.lines
export const selectShifts = (state: RootState) => state.shifts.shifts
export const selectOrders = (state: RootState) => state.orders.orders
export const selectScheduledBlocks = (state: RootState) => state.scheduledBlocks.scheduledBlocks

// Memoized selectors
export const selectUnitById = createSelector(
  [selectUnits, (state: RootState, unitId: string) => unitId],
  (units, unitId) => units.find((unit) => unit.id === unitId),
)

export const selectLineById = createSelector(
  [selectLines, (state: RootState, lineId: string) => lineId],
  (lines, lineId) => lines.find((line) => line.id === lineId),
)

export const selectShiftById = createSelector(
  [selectShifts, (state: RootState, shiftId: string) => shiftId],
  (shifts, shiftId) => shifts.find((shift) => shift.id === shiftId),
)

export const selectOrderById = createSelector(
  [selectOrders, (state: RootState, orderId: string) => orderId],
  (orders, orderId) => orders.find((order) => order.id === orderId),
)

export const selectLinesByUnitId = createSelector(
  [selectLines, (state: RootState, unitId: string) => unitId],
  (lines, unitId) => lines.filter((line) => line.unitId === unitId),
)

export const selectScheduledBlocksByLineId = createSelector(
  [selectScheduledBlocks, (state: RootState, lineId: string) => lineId],
  (scheduledBlocks, lineId) => scheduledBlocks.filter((block) => block.lineId === lineId),
)

export const selectScheduledBlocksByOrderId = createSelector(
  [selectScheduledBlocks, (state: RootState, orderId: string) => orderId],
  (scheduledBlocks, orderId) => scheduledBlocks.filter((block) => block.orderId === orderId),
)

export const selectScheduledBlocksByLineAndDate = createSelector(
  [selectScheduledBlocks, (state: RootState, lineId: string, date: string) => ({ lineId, date })],
  (scheduledBlocks, { lineId, date }) =>
    scheduledBlocks.filter((block) => block.lineId === lineId && block.date === date),
)

export const selectUnscheduledOrders = createSelector(
  [selectOrders, selectScheduledBlocks],
  (orders, scheduledBlocks) => orders.filter((order) => !scheduledBlocks.some((block) => block.orderId === order.id)),
)
