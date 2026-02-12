"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import orderService, {
    type ShippingAddressBackend,
} from "@/services/order.service";
import toast from "react-hot-toast";

const emptyAddress: Omit<ShippingAddressBackend, "id" | "userId"> = {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Sri Lanka",
    isPrimary: false,
};

export default function AddressesPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<ShippingAddressBackend[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<ShippingAddressBackend | null>(null);
    const [formData, setFormData] = useState(emptyAddress);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/signin?redirect=/account/addresses");
            return;
        }
        orderService
            .getShippingAddresses()
            .then(setAddresses)
            .catch(() => toast.error("Failed to load addresses"))
            .finally(() => setLoading(false));
    }, [router]);

    const handleAddAddress = () => {
        setEditingAddress(null);
        setFormData(emptyAddress);
        setShowModal(true);
    };

    const handleEditAddress = (address: ShippingAddressBackend) => {
        setEditingAddress(address);
        setFormData({
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || "",
            city: address.city,
            state: address.state || "",
            postalCode: address.postalCode || "",
            country: address.country || "Sri Lanka",
            isPrimary: address.isPrimary,
        });
        setShowModal(true);
    };

    const handleDeleteAddress = async (id: number) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            await orderService.deleteShippingAddress(id);
            setAddresses((prev) => prev.filter((a) => a.id !== id));
            toast.success("Address deleted");
        } catch {
            toast.error("Failed to delete address");
        }
    };

    const handleSetPrimary = async (id: number) => {
        try {
            await orderService.updateShippingAddress(id, { isPrimary: true });
            setAddresses((prev) =>
                prev.map((a) => ({ ...a, isPrimary: a.id === id }))
            );
            toast.success("Default address updated");
        } catch {
            toast.error("Failed to update default address");
        }
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingAddress) {
                await orderService.updateShippingAddress(editingAddress.id, formData);
                setAddresses((prev) =>
                    prev.map((a) =>
                        a.id === editingAddress.id ? { ...a, ...formData } : a
                    )
                );
                toast.success("Address updated");
            } else {
                const created = await orderService.createShippingAddressFromBackend(formData);
                setAddresses((prev) => [...prev, created]);
                toast.success("Address added");
            }
            setShowModal(false);
        } catch {
            toast.error(editingAddress ? "Failed to update address" : "Failed to add address");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-gray-600">Loading addresses...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Saved Addresses</h2>
                        <p className="text-gray-600">Manage your delivery addresses</p>
                    </div>
                    <Button onClick={handleAddAddress} className="bg-[#005000] hover:bg-[#006600]">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Address
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow relative ${
                            address.isPrimary ? "ring-2 ring-[#005000]" : ""
                        }`}
                    >
                        {address.isPrimary && (
                            <div className="absolute top-4 right-4">
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-800 rounded-full text-xs font-medium">
                                    <Star className="h-3 w-3 fill-current" />
                                    Default
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <MapPin className="h-5 w-5 text-[#006600]" />
                            </div>
                            <h3 className="font-bold text-gray-900">Address</h3>
                        </div>

                        <div className="text-gray-600 space-y-1 mb-4">
                            <p>{address.addressLine1}</p>
                            {address.addressLine2 && <p>{address.addressLine2}</p>}
                            <p>
                                {[address.city, address.state].filter(Boolean).join(", ")}{" "}
                                {address.postalCode}
                            </p>
                            {address.country && <p>{address.country}</p>}
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                            {!address.isPrimary && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetPrimary(address.id)}
                                    className="flex-1"
                                >
                                    Set as Default
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAddress(address)}
                                className={address.isPrimary ? "flex-1" : ""}
                            >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
                            {!address.isPrimary && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteAddress(address.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {addresses.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved addresses</h3>
                    <p className="text-gray-600 mb-6">
                        Add your first delivery address to get started
                    </p>
                    <Button onClick={handleAddAddress} className="bg-[#005000] hover:bg-[#006600]">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                    </Button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
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
                                    value={formData.addressLine2}
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
                                        value={formData.state}
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
                                        value={formData.postalCode}
                                        onChange={(e) =>
                                            setFormData({ ...formData, postalCode: e.target.value })
                                        }
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={formData.country}
                                        onChange={(e) =>
                                            setFormData({ ...formData, country: e.target.value })
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
                                    className="rounded border-gray-300"
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
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
