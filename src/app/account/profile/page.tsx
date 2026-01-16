"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "Male",
    });

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            try {
                const userData = JSON.parse(user);
                setFormData({
                    fullName: userData.name || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    dateOfBirth: userData.dateOfBirth || "",
                    gender: userData.gender || "Male",
                });
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle profile update
        console.log("Profile updated:", formData);
        
        // Update localStorage with new user data
        const user = localStorage.getItem("user");
        let userData;
        if (user) {
            try {
                userData = JSON.parse(user);
            } catch (error) {
                userData = {};
            }
        } else {
            userData = {};
        }
        
        // Update user data
        userData.name = formData.fullName;
        userData.email = formData.email;
        userData.phone = formData.phone;
        userData.dateOfBirth = formData.dateOfBirth;
        userData.gender = formData.gender;
        
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Trigger custom event to update other components
        window.dispatchEvent(new Event("userUpdated"));
        
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
                        <p className="text-gray-600">
                            Manage your personal information and preferences
                        </p>
                    </div>
                    {!isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-lime-500 hover:bg-lime-600"
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>

                {/* Profile Picture */}
                <div className="flex items-center gap-6 pb-8 border-b border-gray-200">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center">
                            <User className="h-12 w-12 text-white" />
                        </div>
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200 hover:border-lime-500 transition-colors">
                                <Camera className="h-4 w-4 text-gray-600" />
                            </button>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{formData.fullName}</h3>
                        <p className="text-gray-600">{formData.email}</p>
                        <p className="text-sm text-lime-600 font-medium mt-1">Premium Member</p>
                    </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-gray-700 font-medium">
                                Full Name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fullName: e.target.value })
                                    }
                                    className="pl-10 h-12"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-medium">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="pl-10 h-12"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-700 font-medium">
                                Phone Number
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    className="pl-10 h-12"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">
                                Date of Birth
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) =>
                                        setFormData({ ...formData, dateOfBirth: e.target.value })
                                    }
                                    className="pl-10 h-12"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-gray-700 font-medium">
                                Gender
                            </Label>
                            <select
                                id="gender"
                                value={formData.gender}
                                onChange={(e) =>
                                    setFormData({ ...formData, gender: e.target.value })
                                }
                                className="w-full h-12 px-3 rounded-lg border border-gray-300 focus:border-lime-500 focus:ring-lime-500 disabled:bg-gray-50"
                                disabled={!isEditing}
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                                <option>Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <Button
                                type="submit"
                                className="bg-lime-500 hover:bg-lime-600 px-8"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </form>
            </div>

            {/* Password Change Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Security</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900">Password</p>
                        <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                </div>
            </div>
        </div>
    );
}
