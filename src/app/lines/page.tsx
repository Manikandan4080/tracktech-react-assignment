"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addLine, updateLine, deleteLine } from "@/store/slices/lineSlices";
import { selectLines, selectUnits } from "@/store/selectors";
import { Line } from "@/types/types";

const LineMaster = () => {
    const dispatch = useAppDispatch();
    const lines = useAppSelector(selectLines);
    const units = useAppSelector(selectUnits);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLine, setEditingLine] = useState<Line | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        unitId: "",
        dailyCapacity: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingLine) {
            dispatch(
                updateLine({
                    ...editingLine,
                    name: formData.name,
                    unitId: formData.unitId,
                    dailyCapacity: Number.parseInt(formData.dailyCapacity),
                })
            );
        } else {
            dispatch(
                addLine({
                    id: Date.now().toString(),
                    name: formData.name,
                    unitId: formData.unitId,
                    dailyCapacity: Number.parseInt(formData.dailyCapacity),
                })
            );
        }

        setFormData({ name: "", unitId: "", dailyCapacity: "" });
        setEditingLine(null);
        setIsDialogOpen(false);
    };

    const handleEdit = (line: Line) => {
        setEditingLine(line);
        setFormData({
            name: line.name,
            unitId: line.unitId,
            dailyCapacity: line.dailyCapacity.toString(),
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        dispatch(deleteLine(id));
    };

    const openAddDialog = () => {
        setEditingLine(null);
        setFormData({ name: "", unitId: "", dailyCapacity: "" });
        setIsDialogOpen(true);
    };

    const getUnitName = (unitId: string) => {
        const unit = units.find((u) => u.id === unitId);
        return unit?.name || "Unknown Unit";
    };

    return (
        <div className="w-full h-full py-6 px-3 bg-gray-50 min-h-screen overflow-auto">
            <Card className="mt-16 md:mt-0">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Line Master</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="cursor-pointer"
                                onClick={openAddDialog}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Line
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingLine ? "Edit Line" : "Add New Line"}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="name">Line Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="unit">
                                        Associated Unit
                                    </Label>
                                    <Select
                                        value={formData.unitId}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                unitId: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {units.map((unit) => (
                                                <SelectItem
                                                    key={unit.id}
                                                    value={unit.id}
                                                >
                                                    {unit.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="capacity">
                                        Daily Capacity (pieces)
                                    </Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        value={formData.dailyCapacity}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                dailyCapacity: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        className="cursor-pointer"
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="cursor-pointer"
                                        type="submit"
                                    >
                                        {editingLine ? "Update" : "Add"}
                                    </Button>
                                </div>
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
                                <TableHead>Daily Capacity</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lines.map((line) => (
                                <TableRow key={line.id}>
                                    <TableCell>{line.name}</TableCell>
                                    <TableCell>
                                        {getUnitName(line.unitId)}
                                    </TableCell>
                                    <TableCell>
                                        {line.dailyCapacity} pieces
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                className="cursor-pointer"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(line)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                className="cursor-pointer"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(line.id)
                                                }
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default LineMaster;
