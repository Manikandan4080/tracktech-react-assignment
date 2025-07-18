"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Shift } from "@/types/types"
import { addShift, deleteShift, updateShift } from "@/store/slices/shiftSlices"

const ShiftMaster = () => {
  const dispatch = useAppDispatch()
  const shifts = useAppSelector((state) => state.shifts.shifts)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [formData, setFormData] = useState({ name: "", startTime: "", endTime: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingShift) {
      dispatch(updateShift({ ...editingShift, ...formData }))
    } else {
      dispatch(
        addShift({
          id: Date.now().toString(),
          name: formData.name,
          startTime: formData.startTime,
          endTime: formData.endTime,
        }),
      )
    }

    setFormData({ name: "", startTime: "", endTime: "" })
    setEditingShift(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift)
    setFormData({ name: shift.name, startTime: shift.startTime, endTime: shift.endTime })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    dispatch(deleteShift(id))
  }

  const resetForm = () => {
    setFormData({ name: "", startTime: "", endTime: "" })
    setEditingShift(null)
  }

  return (
    <div className="w-full h-hull py-6 md:py-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Shift Master</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Shift
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingShift ? "Edit Shift" : "Add New Shift"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Shift Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingShift ? "Update Shift" : "Add Shift"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shift Name</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>{shift.name}</TableCell>
                <TableCell>{shift.startTime}</TableCell>
                <TableCell>{shift.endTime}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(shift)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(shift.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </div>
  )
}

export default ShiftMaster;