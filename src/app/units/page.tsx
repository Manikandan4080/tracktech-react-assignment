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
import { Pencil, Trash2, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addUnit, updateUnit, deleteUnit } from "@/store/slices/unitSlice";
import { selectUnits } from "@/store/selectors";
import { Unit } from "@/types/types";

const UnitMaster = () => {
    const dispatch = useAppDispatch();
    const units = useAppSelector(selectUnits);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [formData, setFormData] = useState({ name: "", location: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUnit) {
            dispatch(updateUnit({ ...editingUnit, ...formData }));
        } else {
            dispatch(
                addUnit({
                    id: Date.now().toString(),
                    name: formData.name,
                    location: formData.location,
                })
            );
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
        dispatch(deleteUnit(id));
    };

    const openAddDialog = () => {
        setEditingUnit(null);
        setFormData({ name: "", location: "" });
        setIsDialogOpen(true);
    };

    return (
        <div className="w-full h-full py-6 px-3 bg-gray-50 min-h-screen overflow-auto">
            <Card className="mt-16 md:mt-0">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Unit Master</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="cursor-pointer"
                                onClick={openAddDialog}
                            >
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
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="name">Unit Name</Label>
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
                                    <Label htmlFor="location">
                                        Location (Optional)
                                    </Label>
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
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="cursor-pointer"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="cursor-pointer"
                                        type="submit"
                                    >
                                        {editingUnit ? "Update" : "Add"}
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
                                <TableHead>Unit Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {units.map((unit) => (
                                <TableRow key={unit.id}>
                                    <TableCell>{unit.name}</TableCell>
                                    <TableCell>
                                        {unit.location || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                className="cursor-pointer"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(unit)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                className="cursor-pointer"
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
            </Card>
        </div>
    );
};

export default UnitMaster;
