"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import { User, Mail, Phone, Calendar, Camera, Save, Briefcase, MapPin, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Globe, Heart, Users, Compass, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { userService } from "@/services";
import toast from "react-hot-toast";
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
    const [currentStep, setCurrentStep] = useState(1);
    const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user.fullName || "",
        email: user.emailAddress || "",
        phone: user.phoneNumber || "",
        secondaryPhone: user.secondaryPhone || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
        gender: user.gender || "",
        occupation: user.occupation || "",
        preferredLanguage: user.preferredLanguage || "ENGLISH",
        maritalStatus: user.maritalStatus || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        interests: user.interests || "",
        referralSource: user.referralSource || "",
    });

    const requiredFields = [
        'fullName', 'phoneNumber', 'profileImg', 'dateOfBirth', 'gender',
        'occupation', 'preferredLanguage', 'maritalStatus', 'address',
        'city', 'state', 'zipCode', 'interests', 'referralSource'
    ];

    const completeness = useMemo(() => {
        // Map required fields to their counterparts in formData or user
        const fieldMap: Record<string, any> = {
            fullName: formData.fullName,
            phoneNumber: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            occupation: formData.occupation,
            preferredLanguage: formData.preferredLanguage,
            maritalStatus: formData.maritalStatus,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            interests: formData.interests,
            referralSource: formData.referralSource,
            profileImg: user.profileImg // This one is not in formData
        };

        const filled = requiredFields.filter(field => !!fieldMap[field]);
        const percentage = Math.round((filled.length / requiredFields.length) * 100);

        return {
            percentage,
            // Only truly complete if all fields filled AND NOT currently editing/incomplete session
            isComplete: !isEditing && filled.length === requiredFields.length,
            missing: requiredFields.filter(field => !fieldMap[field])
        };
    }, [formData, user.profileImg, requiredFields, isEditing]);

    // Auto-enable edit mode if profile is incomplete on mount
    useEffect(() => {
        if (!isInitialCheckDone && !completeness.isComplete) {
            setIsEditing(true);
            setIsInitialCheckDone(true);
        }
    }, [completeness.isComplete, isInitialCheckDone]);

    const handleNextStep = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (currentStep < 2) {
            setIsEditing(true);
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setIsEditing(true);
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission on step 1 - just move forward
        if (currentStep < 2) {
            handleNextStep();
            return;
        }

        setSaving(true);
        try {
            await userService.updateProfile({
                fullName: formData.fullName,
                phoneNumber: formData.phone || undefined,
                secondaryPhone: formData.secondaryPhone || undefined,
                dateOfBirth: formData.dateOfBirth || undefined,
                gender: formData.gender || undefined,
                occupation: formData.occupation || undefined,
                preferredLanguage: formData.preferredLanguage || undefined,
                maritalStatus: formData.maritalStatus || undefined,
                address: formData.address || undefined,
                city: formData.city || undefined,
                state: formData.state || undefined,
                zipCode: formData.zipCode || undefined,
                interests: formData.interests || undefined,
                referralSource: formData.referralSource || undefined,
            });
            const updatedUser = await userService.getProfile();
            if (updatedUser) {
                onUpdate(updatedUser);
            }
            setIsEditing(false);
            setCurrentStep(1); // Reset step for next time they edit
            toast.success("Profile updated successfully!");
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
            {/* Completion Status Card */}
            <div className={cn(
                "rounded-2xl p-5 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all",
                completeness.isComplete
                    ? "bg-green-50 border-green-100"
                    : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100"
            )}>
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner",
                        completeness.isComplete ? "bg-green-100 text-green-600" : "bg-white text-amber-600"
                    )}>
                        {completeness.isComplete ? (
                            <CheckCircle2 className="h-8 w-8" />
                        ) : (
                            <AlertCircle className="h-8 w-8" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 text-lg">
                            {isEditing ? `Wizard Progress: ${completeness.percentage < 100 ? completeness.percentage : 99}%` : `Profile Completion: ${completeness.percentage}%`}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium">
                            {completeness.isComplete
                                ? "Excellent! You are now eligible for all premium membership tiers."
                                : isEditing
                                    ? `You are on Step ${currentStep} of 2. Finish all steps to save your progress.`
                                    : `${completeness.missing.length} fields remaining. Complete them to unlock membership.`}
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full transition-all duration-1000",
                            completeness.isComplete ? "bg-green-500" : "bg-indigo-500"
                        )}
                        style={{ width: `${isEditing && completeness.percentage === 100 ? 99 : completeness.percentage}%` }}
                    />
                </div>

                {!isEditing && !completeness.isComplete && (
                    <Button
                        size="sm"
                        onClick={() => {
                            setIsEditing(true);
                            setCurrentStep(1);
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-12 px-6 font-bold"
                    >
                        Complete Profile
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
                {/* Header with Step Indicator */}
                <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Profile Wizard</h2>
                            <p className="text-gray-500 text-sm font-medium">We collect this data to personalize your shopping experience.</p>
                        </div>
                        {isEditing && (
                            <div className="flex items-center gap-2">
                                {[1, 2].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setCurrentStep(s)}
                                        className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all hover:scale-105 active:scale-95",
                                            currentStep === s
                                                ? "bg-[#005000] text-white scale-110 shadow-lg shadow-green-100"
                                                : currentStep > s
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-400"
                                        )}
                                    >
                                        {currentStep > s ? <CheckCircle2 size={18} /> : s}
                                    </button>
                                ))}
                            </div>
                        )}
                        {!isEditing && (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="bg-[#005000] hover:bg-[#006600] text-white h-11 px-6 rounded-xl font-bold"
                            >
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                {/* Avatar Section */}
                <div className="px-8 py-8 flex flex-col sm:flex-row items-center gap-8 border-b border-gray-50 bg-white">
                    <div className="relative group">
                        <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-[#006600] to-[#004000] p-1 shadow-2xl">
                            <div className="h-full w-full rounded-[2.3rem] bg-white overflow-hidden flex items-center justify-center">
                                {user.profileImg ? (
                                    <img src={user.profileImg} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <Image
                                        src="/logo/Web_Logo_Mart-01%20(1).png"
                                        alt="JS Mart"
                                        width={120}
                                        height={120}
                                        className="h-full w-full object-contain"
                                    />
                                )}
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <button
                            type="button"
                            disabled={uploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 hover:border-[#005000] text-[#005000] transition-all hover:scale-110"
                        >
                            {uploading ? <Loader2 className="animate-spin h-5 w-5" /> : <Camera size={20} />}
                        </button>
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-2xl font-black text-gray-900 mb-1">{user.fullName || "Your Name"}</h3>
                        <p className="text-gray-500 font-medium mb-3">{user.emailAddress}</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                            {user?.activeSubscription?.plan && (
                                <span className={cn(
                                    "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm",
                                    user.activeSubscription.plan.level === 2 ? "bg-amber-500" : "bg-indigo-600"
                                )}>
                                    {user.activeSubscription.plan.name} Member
                                </span>
                            )}
                            <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500">
                                Member since {new Date(user.createdAt).getFullYear()}
                            </span>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
                            e.preventDefault(); // Stop accidental save/reset on Enter
                        }
                    }}
                    className="p-8"
                >
                    {/* View Mode: Profile Overview */}
                    {!isEditing && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg text-green-600"><CheckCircle2 size={20} /></div>
                                    <h4 className="text-lg font-black text-gray-900">Account Overview</h4>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(true);
                                        setCurrentStep(1);
                                    }}
                                    variant="outline"
                                    className="rounded-xl font-bold text-xs border-green-100 text-green-700 hover:bg-green-50"
                                >
                                    Modify Data
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                                {/* Column 1: Personal & Contact */}
                                <div className="space-y-6">
                                    <div>
                                        <h5 className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <User size={12} /> Identity & Contact
                                        </h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Legal Name</p>
                                                <p className="font-bold text-gray-900 border-l-2 border-indigo-100 pl-3">{formData.fullName || "—"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Birthday</p>
                                                <p className="font-bold text-gray-900 border-l-2 border-indigo-100 pl-3">
                                                    {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "—"}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Primary Phone</p>
                                                <p className="font-bold text-gray-900 border-l-2 border-indigo-100 pl-3">{formData.phone || "—"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Secondary Phone</p>
                                                <p className="font-bold text-gray-900 border-l-2 border-indigo-100 pl-3">{formData.secondaryPhone || "None"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gender Identity</p>
                                                <p className="font-bold text-gray-900 border-l-2 border-indigo-100 pl-3 capitalize">{formData.gender?.toLowerCase().replace(/_/g, ' ') || "—"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Marital Status</p>
                                                <p className="font-bold text-gray-900 border-l-2 border-indigo-100 pl-3 capitalize">{formData.maritalStatus?.toLowerCase() || "—"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <MapPin size={12} /> Primary Address
                                        </h5>
                                        <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100/50 space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Street Address</p>
                                                <p className="font-bold text-gray-900 leading-tight">{formData.address || "Not provided"}</p>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-3">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">City</p>
                                                    <p className="font-bold text-gray-800 text-sm">{formData.city || "—"}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">State</p>
                                                    <p className="font-bold text-gray-800 text-sm">{formData.state || "—"}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Zip</p>
                                                    <p className="font-bold text-gray-800 text-sm">{formData.zipCode || "—"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Lifestyle & Preferences */}
                                <div className="space-y-8">
                                    <div>
                                        <h5 className="text-[10px] font-black uppercase text-purple-600 tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <Globe size={12} /> Lifestyle & Social
                                        </h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Occupation</p>
                                                <p className="font-bold text-gray-900">{formData.occupation || "—"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Language</p>
                                                <p className="font-bold text-gray-900">{formData.preferredLanguage}</p>
                                            </div>
                                            <div className="space-y-1 sm:col-span-2">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">How you found us</p>
                                                <p className="font-bold text-gray-900 capitalize">{formData.referralSource?.toLowerCase().replace(/_/g, ' ') || "Direct Visit"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="text-[10px] font-black uppercase text-pink-600 tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <Heart size={12} /> Shopping Interests
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.interests ? (
                                                formData.interests.split(',').map((interest, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-pink-50 text-pink-700 text-[11px] font-bold rounded-full border border-pink-100 shadow-sm"
                                                    >
                                                        {interest.trim()}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No interests selected</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-teal-50/30 rounded-2xl border border-teal-100/50 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shrink-0 shadow-sm">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-teal-800 uppercase tracking-widest">Store Loyalty</p>
                                            <p className="text-xs font-medium text-teal-600">Active member for {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 12 * 30))} months</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!completeness.isComplete && (
                                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm shadow-amber-50/50">
                                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                    <p className="text-xs font-medium text-amber-800 leading-relaxed">
                                        Your profile is still missing data. Click <strong>Complete Profile</strong> or <strong>Edit Profile</strong> to finish and unlock all features.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 1: Basic Info */}
                    {isEditing && currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 shadow-sm"><User size={20} /></div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 leading-tight">Step 1: Identity</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Personal Profile</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="pl-10 h-11 rounded-xl"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Primary Phone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="pl-10 h-11 rounded-xl"
                                            placeholder="+94 77 123 4567"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Secondary Phone (Optional)</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            value={formData.secondaryPhone}
                                            onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                                            className="pl-10 h-11 rounded-xl"
                                            placeholder="+94 71 000 0000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Date of Birth</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            className="pl-10 h-11 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Gender Identity</Label>
                                    <Select
                                        value={formData.gender}
                                        onChange={(e: any) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="NON_BINARY">Non-binary</option>
                                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Marital Status</Label>
                                    <Select
                                        value={formData.maritalStatus}
                                        onChange={(e: any) => setFormData({ ...formData, maritalStatus: e.target.value })}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="SINGLE">Single</option>
                                        <option value="MARRIED">Married</option>
                                        <option value="DIVORCED">Divorced</option>
                                        <option value="WIDOWED">Widowed</option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Analysis & Location Info */}
                    {isEditing && currentStep === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600 shadow-sm"><Globe size={20} /></div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 leading-tight">Step 2: Social & Location</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Final Details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Occupation</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            value={formData.occupation}
                                            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                            className="pl-10 h-11 rounded-xl"
                                            placeholder="Engineer, Doctor, Student, etc."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Preferred Language</Label>
                                    <Select
                                        value={formData.preferredLanguage}
                                        onChange={(e: any) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                                    >
                                        <option value="ENGLISH">English</option>
                                        <option value="SINHALA">Sinhala</option>
                                        <option value="TAMIL">Tamil</option>
                                        <option value="HINDI">Hindi</option>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-sm font-bold text-gray-700">Residential Address</Label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-3 p-1">
                                            <MapPin size={18} className="text-gray-400" />
                                        </div>
                                        <Input
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="pl-10 h-11 rounded-xl"
                                            placeholder="Street address..."
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 md:col-span-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-600">City</Label>
                                        <Input
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="h-10 rounded-xl"
                                            placeholder="Colombo"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-600">State</Label>
                                        <Input
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="h-10 rounded-xl"
                                            placeholder="Western"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-600">Zip</Label>
                                        <Input
                                            value={formData.zipCode}
                                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                            className="h-10 rounded-xl"
                                            placeholder="10110"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 md:col-span-2 py-4 border-t border-gray-50 mt-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-bold text-gray-700">Shopping Interests</Label>
                                        <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Easy Select</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "Electronics", "Fashion", "Groceries", "Sports", "Beauty",
                                            "Home Decor", "Toys", "Health", "Automotive", "Books", "Pets"
                                        ].map((interest) => {
                                            const isSelected = formData.interests.split(',').map(i => i.trim()).includes(interest);
                                            return (
                                                <button
                                                    key={interest}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = formData.interests.split(',').map(i => i.trim()).filter(Boolean);
                                                        const updated = isSelected
                                                            ? current.filter(i => i !== interest)
                                                            : [...current, interest];
                                                        setFormData({ ...formData, interests: updated.join(', ') });
                                                    }}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                                        isSelected
                                                            ? "bg-[#005000] text-white border-[#005000]"
                                                            : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                                                    )}
                                                >
                                                    {interest}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-sm font-bold text-gray-700">Referral Source</Label>
                                    <Select
                                        value={formData.referralSource}
                                        onChange={(e: any) => setFormData({ ...formData, referralSource: e.target.value })}
                                    >
                                        <option value="">Select Source</option>
                                        <option value="SOCIAL_MEDIA">Social Media</option>
                                        <option value="FRIENDS">Friends & Family</option>
                                        <option value="ADVERTISEMENTS">Advertisements</option>
                                        <option value="STORE_VISIT">Store Visit</option>
                                        <option value="SEARCH_ENGINE">Search Engine</option>
                                    </Select>
                                </div>
                            </div>

                            {/* Missing Image Warning */}
                            {!user.profileImg && (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                                    <Camera className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                    <p className="text-xs font-medium text-amber-800">
                                        Reminder: Don't forget to scroll up and upload your profile photo to reach 100% completion!
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {isEditing && (
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                {currentStep > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handlePrevStep}
                                        className="h-12 px-6 rounded-xl font-bold border-gray-200 hover:bg-gray-50 transition-all"
                                    >
                                        <ChevronLeft className="mr-2" size={18} /> Back
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setCurrentStep(1);
                                    }}
                                    className="h-12 px-6 rounded-xl font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                    Cancel
                                </Button>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {currentStep < 2 ? (
                                    <Button
                                        key="step-continue-button"
                                        type="button"
                                        onClick={(e) => handleNextStep(e)}
                                        className="w-full sm:w-auto h-12 px-10 rounded-2xl font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-100 hover:-translate-y-0.5 transition-all active:scale-95"
                                    >
                                        Continue <ChevronRight className="ml-2" size={18} />
                                    </Button>
                                ) : (
                                    <Button
                                        key="step-finish-button"
                                        type="submit"
                                        disabled={saving}
                                        className="w-full sm:w-auto h-12 px-10 rounded-2xl font-black bg-[#005000] hover:bg-[#006600] text-white shadow-2xl shadow-green-200 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                                    >
                                        {saving ? (
                                            <Loader2 className="animate-spin h-5 w-5" />
                                        ) : (
                                            <>
                                                <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                Celebrate & Finish
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
