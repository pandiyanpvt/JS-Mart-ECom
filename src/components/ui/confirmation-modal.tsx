"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AlertCircle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalType = "info" | "success" | "warning" | "error" | "confirm";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    type?: ModalType;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
}

const modalStyles = {
    info: {
        icon: <Info className="h-6 w-6 text-blue-600" />,
        bg: "bg-blue-50",
        btn: "bg-blue-600 hover:bg-blue-700",
        border: "border-blue-100",
    },
    success: {
        icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />,
        bg: "bg-emerald-50",
        btn: "bg-emerald-600 hover:bg-emerald-700",
        border: "border-emerald-100",
    },
    warning: {
        icon: <AlertCircle className="h-6 w-6 text-amber-600" />,
        bg: "bg-amber-50",
        btn: "bg-amber-600 hover:bg-amber-700",
        border: "border-amber-100",
    },
    confirm: {
        icon: <AlertCircle className="h-6 w-6 text-indigo-600" />,
        bg: "bg-indigo-50",
        btn: "bg-indigo-600 hover:bg-indigo-700",
        border: "border-indigo-100",
    },
    error: {
        icon: <XCircle className="h-6 w-6 text-rose-600" />,
        bg: "bg-rose-50",
        btn: "bg-rose-600 hover:bg-rose-700",
        border: "border-rose-100",
    },
};

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = "confirm",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    loading = false,
}: ConfirmationModalProps) {
    const style = modalStyles[type];

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100">
                                <div className="absolute right-4 top-4">
                                    <button
                                        type="button"
                                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                                        onClick={onClose}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="bg-white px-6 pb-6 pt-8">
                                    <div className="sm:flex sm:items-start">
                                        <div className={cn(
                                            "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl sm:mx-0 sm:h-10 sm:w-10",
                                            style.bg
                                        )}>
                                            {style.icon}
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900">
                                                {title}
                                            </Dialog.Title>
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-500 leading-relaxed">
                                                    {message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50/50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-100">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto transition-all"
                                        onClick={onClose}
                                        disabled={loading}
                                    >
                                        {cancelLabel}
                                    </button>
                                    <button
                                        type="button"
                                        className={cn(
                                            "inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md sm:w-auto transition-all items-center gap-2",
                                            style.btn,
                                            loading && "opacity-70 cursor-not-allowed"
                                        )}
                                        onClick={onConfirm}
                                        disabled={loading}
                                    >
                                        {loading && (
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        )}
                                        {confirmLabel}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
