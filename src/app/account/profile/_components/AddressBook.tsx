"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shippingAddressService } from "@/services";
import { ShippingAddress } from "@/services/shippingAddress.service";
import toast from "react-hot-toast";
import { useModal } from "@/components/providers/ModalProvider";

export function AddressBook() {
    const { showModal } = useModal();
    const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                    <Button className="bg-[#005000] hover:bg-[#006600]">
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
                                    <button className="text-sm font-bold text-[#005000] hover:underline flex items-center gap-1">
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
        </div>
    );
}
