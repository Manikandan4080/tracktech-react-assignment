export interface Unit {
  id: string
  name: string
  location?: string
}

export interface Line {
  id: string
  name: string
  unitId: string
  dailyCapacity: number
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
  assignedLines: string[]
  shiftId: string
  scheduledDates?: {
    lineId: string
    date: string
    allocatedQuantity: number
  }[]
}


export interface ScheduledBlock {
  blockId: string
  orderId: string
  lineId: string
  date: string
  allocatedQuantity: number
  styleName: string
  orderNo: string
}