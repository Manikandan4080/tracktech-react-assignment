"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

import { Plus, Edit, Trash2 } from "lucide-react"
import { addLine, deleteLine, updateLine } from "@/store/slices/lineSlices"
import { Line } from "@/types/types"

const LineMaster = () => {
  const dispatch = useAppDispatch()
  const lines = useAppSelector((state) => state.lines.lines)
  const units = useAppSelector((state) => state.units.units)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLine, setEditingLine] = useState<Line | null>(null)
  const [formData, setFormData] = useState({ name: "", unitId: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingLine) {
      dispatch(updateLine({ ...editingLine, ...formData }))
    } else {
      dispatch(
        addLine({
          id: Date.now().toString(),
          name: formData.name,
          unitId: formData.unitId,
        }),
      )
    }

    setFormData({ name: "", unitId: "" })
    setEditingLine(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (line: Line) => {
    setEditingLine(line)
    setFormData({ name: line.name, unitId: line.unitId })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    dispatch(deleteLine(id))
  }

  const resetForm = () => {
    setFormData({ name: "", unitId: "" })
    setEditingLine(null)
  }

  const getUnitName = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId)
    return unit?.name || "Unknown Unit"
  }

  return (
    <div className="w-full h-hull py-6 md:py-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Line Master</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Line
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLine ? "Edit Line" : "Add New Line"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Line Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="unit">Unit *</Label>
                <Select
                  value={formData.unitId}
                  onValueChange={(value) => setFormData({ ...formData, unitId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                {editingLine ? "Update Line" : "Add Line"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Line Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell>{line.name}</TableCell>
                <TableCell>{getUnitName(line.unitId)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(line)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(line.id)}>
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

export default LineMaster;