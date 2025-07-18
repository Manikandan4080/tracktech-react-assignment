export interface Unit {
  id: string
  name: string
  location?: string
}

export interface Line {
  id: string
  name: string
  unitId: string
}

export interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
}

export interface Order {
  id: string
  orderNo: string
  styleName: string
  quantity: number
  deliveryDate: string
  unitId: string
  lineIds: string[]
  shiftId: string
  scheduledDate?: string
  scheduledLineId?: string
}

export interface ScheduledOrder extends Order {
  scheduledDate: string
  scheduledLineId: string
}

export interface OrdersState {
  orders: Order[]
  scheduledOrders: ScheduledOrder[]
}