"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ConfirmationModal, ModalType } from "../ui/confirmation-modal";

interface ModalOptions {
    title: string;
    message: string;
    type?: ModalType;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void | Promise<void>;
}

interface ModalContextType {
    showModal: (options: ModalOptions) => void;
    hideModal: () => void;
    isLoading: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<ModalOptions | null>(null);

    const showModal = useCallback((newOptions: ModalOptions) => {
        setOptions(newOptions);
        setIsOpen(true);
    }, []);

    const hideModal = useCallback(() => {
        setIsOpen(false);
        setOptions(null);
        setIsLoading(false);
    }, []);

    const handleConfirm = async () => {
        if (options?.onConfirm) {
            setIsLoading(true);
            try {
                await options.onConfirm();
                hideModal();
            } catch (error) {
                console.error("Modal action failed:", error);
                setIsLoading(false);
            }
        } else {
            hideModal();
        }
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal, isLoading }}>
            {children}
            {options && (
                <ConfirmationModal
                    isOpen={isOpen}
                    onClose={hideModal}
                    onConfirm={handleConfirm}
                    title={options.title}
                    message={options.message}
                    type={options.type}
                    confirmLabel={options.confirmLabel}
                    cancelLabel={options.cancelLabel}
                    loading={isLoading}
                />
            )}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
}
