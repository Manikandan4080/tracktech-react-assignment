"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import toast from "react-hot-toast";

import { Plus, Edit, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addUnit, deleteUnit, updateUnit } from "@/store/slices/unitSlice";
import { Unit } from "@/types/types";
import { deleteLinesByUnit } from "@/store/slices/lineSlices";

const UnitMaster = () => {
    const dispatch = useAppDispatch();
    const units = useAppSelector((state) => state.units.units);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [formData, setFormData] = useState({ name: "", location: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUnit) {
            dispatch(updateUnit({ ...editingUnit, ...formData }));
            toast.success("Unit updated successfully!");
        } else {
            dispatch(
                addUnit({
                    id: Date.now().toString(),
                    name: formData.name,
                    location: formData.location || undefined,
                })
            );
            toast.success("Unit added successfully!");
        }

        setFormData({ name: "", location: "" });
        setEditingUnit(null);
        setIsDialogOpen(false);
    };

    const handleEdit = (unit: Unit) => {
        setEditingUnit(unit);
        setFormData({ name: unit.name, location: unit.location || "" });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        const toastId = toast.loading("Deleting unit...");

        setTimeout(() => {
            dispatch(deleteUnit(id));
            dispatch(deleteLinesByUnit(id))

            toast(`Unit removed`, {
                id: toastId,
                icon: "🗑️",
                duration: 2000,
            });
        }, 500);
    };

    const resetForm = () => {
        setFormData({ name: "", location: "" });
        setEditingUnit(null);
    };

    return (
        <div className="shadow-none rounded-none w-full h-full py-6 md:py-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Unit Master</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Unit
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingUnit ? "Edit Unit" : "Add New Unit"}
                            </DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Unit Name *</Label>
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
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            location: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                {editingUnit ? "Update Unit" : "Add Unit"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Unit Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {units.map((unit) => (
                            <TableRow key={unit.id}>
                                <TableCell>{unit.name}</TableCell>
                                <TableCell>{unit.location || "-"}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(unit)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleDelete(unit.id)
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
        </div>
    );
};

export default UnitMaster;
