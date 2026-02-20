"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapPin, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import shippingAddressService, { ShippingAddress } from "@/services/shippingAddress.service";
import toast from "react-hot-toast";
import { useModal } from "@/components/providers/ModalProvider";

const emptyAddress: Omit<ShippingAddress, "id" | "userId"> = {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    isPrimary: false,
};

export function AddressBook() {
    const { showModal } = useModal();
    const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
    const [formData, setFormData] = useState(emptyAddress);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const data = await shippingAddressService.getMyAddresses();
            setAddresses(data);
        } catch {
            toast.error("Failed to load addresses");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = () => {
        setEditingAddress(null);
        setFormData(emptyAddress);
        setShowFormModal(true);
    };

    const handleEditAddress = (address: ShippingAddress) => {
        setEditingAddress(address);
        setFormData({
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || "",
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            isPrimary: address.isPrimary,
        });
        setShowFormModal(true);
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingAddress) {
                const updated = await shippingAddressService.updateAddress(editingAddress.id, formData);
                setAddresses(prev => prev.map(a => a.id === editingAddress.id ? updated : a));
                toast.success("Address updated");
            } else {
                const created = await shippingAddressService.saveAddress(formData);
                setAddresses(prev => [...prev, created]);
                toast.success("Address added");
            }
            setShowFormModal(false);
            if (formData.isPrimary) {
                fetchAddresses();
            }
        } catch {
            toast.error(editingAddress ? "Failed to update address" : "Failed to add address");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id: number) => {
        showModal({
            title: "Delete Address",
            message: "Are you sure you want to remove this shipping address?",
            type: "error",
            confirmLabel: "Delete",
            onConfirm: async () => {
                try {
                    await shippingAddressService.deleteAddress(id);
                    setAddresses(addresses.filter(a => a.id !== id));
                    toast.success("Address removed");
                } catch {
                    toast.error("Failed to remove address");
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Shipping Addresses</h2>
                    <Button onClick={handleAddAddress} className="bg-[#005000] hover:bg-[#006600]">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Address
                    </Button>
                </div>

                {loading ? (
                    <p className="text-center py-8 text-gray-500">Loading addresses...</p>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No addresses saved yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                            <div key={address.id} className={`relative p-6 rounded-xl border-2 transition-all ${address.isPrimary ? 'border-[#005000] bg-green-50/30' : 'border-gray-100'
                                }`}>
                                {address.isPrimary && (
                                    <div className="absolute top-4 right-4 bg-[#005000] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        DEFAULT
                                    </div>
                                )}
                                <div className="space-y-2 mb-6">
                                    <p className="font-bold text-gray-900">{address.addressLine1}</p>
                                    <p className="text-gray-600">{address.addressLine2}</p>
                                    <p className="text-gray-600">{address.city}, {address.state} {address.postalCode}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleEditAddress(address)}
                                        className="text-sm font-bold text-[#005000] hover:underline flex items-center gap-1"
                                    >
                                        <Edit2 className="h-3.5 w-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.id)}
                                        className="text-sm font-bold text-red-600 hover:underline flex items-center gap-1"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Address Form Modal */}
            {mounted && showFormModal && createPortal(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[99999]">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowFormModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            {editingAddress ? "Edit Address" : "Add New Address"}
                        </h3>

                        <form onSubmit={handleSubmitForm} className="space-y-4">
                            <div>
                                <Label htmlFor="addressLine1">Street address *</Label>
                                <Input
                                    id="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={(e) =>
                                        setFormData({ ...formData, addressLine1: e.target.value })
                                    }
                                    className="mt-1"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="addressLine2">Apartment, suite, etc. (optional)</Label>
                                <Input
                                    id="addressLine2"
                                    value={formData.addressLine2 || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, addressLine2: e.target.value })
                                    }
                                    className="mt-1"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) =>
                                            setFormData({ ...formData, city: e.target.value })
                                        }
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="state">State / Province</Label>
                                    <Input
                                        id="state"
                                        value={formData.state || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, state: e.target.value })
                                        }
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="postalCode">Postal code</Label>
                                    <Input
                                        id="postalCode"
                                        value={formData.postalCode || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, postalCode: e.target.value })
                                        }
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPrimary"
                                    checked={formData.isPrimary}
                                    onChange={(e) =>
                                        setFormData({ ...formData, isPrimary: e.target.checked })
                                    }
                                    className="rounded border-gray-300 w-4 h-4 text-[#005000] focus:ring-[#005000]"
                                />
                                <Label htmlFor="isPrimary">Set as default address</Label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-[#005000] hover:bg-[#006600]"
                                >
                                    {saving ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowFormModal(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
