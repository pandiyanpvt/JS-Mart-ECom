"use client";

import { useState, useRef } from "react";
import { User, Mail, Phone, Calendar, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userService } from "@/services";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { IMAGE_SPECS, validateImageFileSize } from "@/lib/imageSpecs";

interface ProfileDetailsProps {
    user: any;
    onUpdate: (updatedUser: any) => void;
}

export function ProfileDetails({ user, onUpdate }: ProfileDetailsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user.fullName || "",
        email: user.emailAddress || "",
        phone: user.phoneNumber || "",
        dateOfBirth: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await userService.updateProfile({
                fullName: formData.fullName,
                phoneNumber: formData.phone || undefined,
            });
            const updatedUser = await userService.getProfile();
            if (updatedUser) {
                onUpdate(updatedUser);
            }
            setIsEditing(false);
            toast.success("Profile updated");
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const { valid, message } = validateImageFileSize(file, "profileAvatar");
        if (!valid) {
            toast.error(message);
            e.target.value = "";
            return;
        }
        setUploading(true);
        try {
            const updated = await userService.uploadProfileImage(file);
            onUpdate(updated);
            toast.success("Photo updated");
        } catch {
            toast.error("Failed to upload photo");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">My Profile Details</h2>
                    {!isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-[#005000] hover:bg-[#006600] text-xs sm:text-sm min-h-[44px] touch-manipulation"
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-gray-100">
                    <div className="relative shrink-0">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-[#006600] to-[#005000] flex items-center justify-center overflow-hidden">
                            {user.profileImg ? (
                                <img src={user.profileImg} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <button
                            type="button"
                            disabled={uploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 sm:p-2 shadow-lg border border-gray-200 hover:border-[#005000] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
                        >
                            <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
                        </button>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium mb-1">Photo: max {IMAGE_SPECS.profileAvatar.maxFileSizeLabel}, {IMAGE_SPECS.profileAvatar.width}×{IMAGE_SPECS.profileAvatar.height} px recommended.</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{user.fullName || "User"}</h3>
                            {user?.activeSubscription?.plan && (
                                <span className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter text-white shadow-sm shrink-0",
                                    user.activeSubscription.plan.level === 2 ? "bg-amber-500" : "bg-indigo-600"
                                )}>
                                    {user.activeSubscription.plan.name} Member
                                </span>
                            )}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 truncate">{user.emailAddress}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="pl-10"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    value={formData.email}
                                    className="pl-10 bg-gray-50"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="pl-10"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Date of Birth</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    className="pl-10"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-100">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-[#005000] hover:bg-[#006600] min-h-[44px] touch-manipulation"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                className="min-h-[44px] touch-manipulation"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
