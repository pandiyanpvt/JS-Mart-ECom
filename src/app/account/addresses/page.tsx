"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2, Home, Briefcase, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Address {
    id: number;
    type: "Home" | "Work" | "Other";
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const [userName, setUserName] = useState("User");
    const [userPhone, setUserPhone] = useState("");
    
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            try {
                const userData = JSON.parse(user);
                setUserName(userData.name || "User");
                setUserPhone(userData.phone || "");
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: 1,
            type: "Home",
            name: "",
            street: "123 Market Street",
            city: "Sydney",
            state: "NSW",
            zip: "2000",
            country: "Australia",
            phone: "",
            isDefault: true,
        },
        {
            id: 2,
            type: "Work",
            name: "",
            street: "456 Business Ave",
            city: "Melbourne",
            state: "VIC",
            zip: "3000",
            country: "Australia",
            phone: "",
            isDefault: false,
        },
    ]);

    // Update addresses when user data changes
    useEffect(() => {
        if (userName || userPhone) {
            setAddresses((prev) =>
                prev.map((addr) => ({
                    ...addr,
                    name: userName || addr.name,
                    phone: userPhone || addr.phone || "+61 412 345 678",
                }))
            );
        }
    }, [userName, userPhone]);

    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const handleAddAddress = () => {
        setEditingAddress(null);
        setShowModal(true);
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setShowModal(true);
    };

    const handleDeleteAddress = (id: number) => {
        if (confirm("Are you sure you want to delete this address?")) {
            setAddresses(addresses.filter((addr) => addr.id !== id));
        }
    };

    const handleSetDefault = (id: number) => {
        setAddresses(
            addresses.map((addr) => ({
                ...addr,
                isDefault: addr.id === id,
            }))
        );
    };

    const getTypeIcon = (type: Address["type"]) => {
        switch (type) {
            case "Home":
                return Home;
            case "Work":
                return Briefcase;
            default:
                return MapPin;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Saved Addresses</h2>
                        <p className="text-gray-600">Manage your delivery addresses</p>
                    </div>
                    <Button onClick={handleAddAddress} className="bg-[#3BB77E] hover:bg-[#299E63]">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Address
                    </Button>
                </div>
            </div>

            {/* Addresses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => {
                    const TypeIcon = getTypeIcon(address.type);
                    return (
                        <div
                            key={address.id}
                            className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow relative ${address.isDefault ? "ring-2 ring-[#3BB77E]" : ""
                                }`}
                        >
                            {/* Default Badge */}
                            {address.isDefault && (
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-lime-50 text-lime-700 rounded-full text-xs font-medium">
                                        <Star className="h-3 w-3 fill-current" />
                                        Default
                                    </span>
                                </div>
                            )}

                            {/* Address Type */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-lime-100 p-2 rounded-lg">
                                    <TypeIcon className="h-5 w-5 text-[#299E63]" />
                                </div>
                                <h3 className="font-bold text-gray-900">{address.type}</h3>
                            </div>

                            {/* Address Details */}
                            <div className="text-gray-600 space-y-1 mb-4">
                                <p className="font-semibold text-gray-900">{address.name}</p>
                                <p>{address.street}</p>
                                <p>
                                    {address.city}, {address.state} {address.zip}
                                </p>
                                <p>{address.country}</p>
                                <p className="text-sm">{address.phone}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-gray-200">
                                {!address.isDefault && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSetDefault(address.id)}
                                        className="flex-1"
                                    >
                                        Set as Default
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditAddress(address)}
                                    className={address.isDefault ? "flex-1" : ""}
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                                {!address.isDefault && (
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
                    );
                })}
            </div>

            {/* Empty State */}
            {addresses.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No saved addresses
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Add your first delivery address to get started
                    </p>
                    <Button onClick={handleAddAddress} className="bg-[#3BB77E] hover:bg-[#299E63]">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                    </Button>
                </div>
            )}

            {/* Address Modal (simplified - you can enhance this) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            {editingAddress ? "Edit Address" : "Add New Address"}
                        </h3>

                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        defaultValue={editingAddress?.name || userName}
                                        className="mt-1"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="street">Street Address</Label>
                                    <Input
                                        id="street"
                                        defaultValue={editingAddress?.street}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        defaultValue={editingAddress?.city}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        defaultValue={editingAddress?.state}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="zip">Postal Code</Label>
                                    <Input
                                        id="zip"
                                        defaultValue={editingAddress?.zip}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        defaultValue={editingAddress?.phone || userPhone}
                                        className="mt-1"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="type">Address Type</Label>
                                    <select
                                        id="type"
                                        defaultValue={editingAddress?.type || "Home"}
                                        className="w-full h-10 px-3 rounded-lg border border-gray-300 mt-1"
                                    >
                                        <option>Home</option>
                                        <option>Work</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    className="flex-1 bg-[#3BB77E] hover:bg-[#299E63]"
                                >
                                    Save Address
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
