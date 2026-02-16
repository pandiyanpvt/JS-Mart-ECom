"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Calendar, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import userService from "@/services/user.service";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
    });

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/signin?redirect=/account/profile");
            return;
        }
        userService.getProfile()
            .then((user) => {
                if (!user) return;
                setFormData({
                    fullName: user.fullName || "",
                    email: user.emailAddress || "",
                    phone: user.phoneNumber || "",
                    dateOfBirth: "",
                });
                setProfileImg(user.profileImg || null);
                Cookies.set("user", JSON.stringify({ ...user, id: user.id, emailAddress: user.emailAddress, fullName: user.fullName, phoneNumber: user.phoneNumber }), { expires: 1 });
            })
            .catch(() => toast.error("Failed to load profile"))
            .finally(() => setLoading(false));
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await userService.updateProfile({
                fullName: formData.fullName,
                phoneNumber: formData.phone || undefined,
            });
            const user = await userService.getProfile();
            if (user) {
                setFormData((prev) => ({ ...prev, fullName: user.fullName || prev.fullName, phone: user.phoneNumber || prev.phone }));
                Cookies.set("user", JSON.stringify({ ...user, id: user.id, emailAddress: user.emailAddress, fullName: user.fullName, phoneNumber: user.phoneNumber }), { expires: 1 });
            }
            window.dispatchEvent(new Event("auth-change"));
            window.dispatchEvent(new Event("userUpdated"));
            setIsEditing(false);
            toast.success("Profile updated");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const updated = await userService.uploadProfileImage(file);
            setProfileImg(updated.profileImg || null);
            Cookies.set("user", JSON.stringify({ ...updated, id: updated.id, emailAddress: updated.emailAddress, fullName: updated.fullName, phoneNumber: updated.phoneNumber, profileImg: updated.profileImg }), { expires: 1 });
            window.dispatchEvent(new Event("auth-change"));
            window.dispatchEvent(new Event("userUpdated"));
            toast.success("Photo updated");
        } catch {
            toast.error("Failed to upload photo");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    My Profile
                </h1>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 pb-12">
                <div className="space-y-6">
                    {/* Profile Header */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <div className="flex items-start justify-end mb-6">
                            {!isEditing && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-[#005000] hover:bg-[#006600]"
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </div>

                        {/* Profile Picture */}
                        <div className="flex items-center gap-6 pb-8 border-b border-gray-200">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                disabled={uploading}
                            />
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#006600] to-[#005000] flex items-center justify-center overflow-hidden">
                                    {profileImg ? (
                                        <img src={profileImg} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-12 w-12 text-white" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    disabled={uploading}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200 hover:border-[#005000] transition-colors disabled:opacity-50"
                                >
                                    <Camera className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{formData.fullName}</h3>
                                <p className="text-gray-600">{formData.email}</p>
                                <p className="text-sm text-[#006600] font-medium mt-1">Premium Member</p>
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
                                            className="pl-10 h-12 bg-gray-50"
                                            readOnly
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Email cannot be changed here.</p>
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
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex gap-4 pt-6 border-t border-gray-200">
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-[#005000] hover:bg-[#006600] px-8"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {saving ? "Saving..." : "Save Changes"}
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
            </div>
        </div>
    );
}
