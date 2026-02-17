"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Plus, Edit, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface PaymentCard {
    id: number;
    type: "Visa" | "Mastercard" | "Amex";
    last4: string;
    expiryMonth: string;
    expiryYear: string;
    holderName: string;
    isDefault: boolean;
}

export default function CardsPage() {
    const router = useRouter();
    const [userName, setUserName] = useState("User");

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/signin?redirect=/account/cards");
            return;
        }

        const user = Cookies.get("user");
        if (user) {
            try {
                const userData = JSON.parse(user);
                let fullName = "User";
                if (userData.firstName && userData.lastName) {
                    fullName = `${userData.firstName} ${userData.lastName}`;
                } else if (userData.fullName) {
                    fullName = userData.fullName;
                } else if (userData.firstName) {
                    fullName = userData.firstName;
                } else if (userData.name) {
                    fullName = userData.name;
                }
                setUserName(fullName);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, [router]);

    const [cards, setCards] = useState<PaymentCard[]>([
        {
            id: 1,
            type: "Visa",
            last4: "4242",
            expiryMonth: "12",
            expiryYear: "2026",
            holderName: "",
            isDefault: true,
        },
        {
            id: 2,
            type: "Mastercard",
            last4: "5555",
            expiryMonth: "08",
            expiryYear: "2027",
            holderName: "",
            isDefault: false,
        },
    ]);

    // Update cards when user data changes
    useEffect(() => {
        if (userName) {
            setCards((prev) =>
                prev.map((card) => ({
                    ...card,
                    holderName: userName || card.holderName,
                }))
            );
        }
    }, [userName]);

    const [showModal, setShowModal] = useState(false);
    const [showCVV, setShowCVV] = useState(false);
    const [editingCard, setEditingCard] = useState<PaymentCard | null>(null);

    const handleAddCard = () => {
        setEditingCard(null);
        setShowCVV(false);
        setShowModal(true);
    };

    const handleEditCard = (card: PaymentCard) => {
        setEditingCard(card);
        setShowCVV(false);
        setShowModal(true);
    };

    const handleDeleteCard = (id: number) => {
        if (confirm("Are you sure you want to delete this payment method?")) {
            setCards(cards.filter((card) => card.id !== id));
        }
    };

    const handleSetDefault = (id: number) => {
        setCards(
            cards.map((card) => ({
                ...card,
                isDefault: card.id === id,
            }))
        );
    };

    const getCardColor = (type: PaymentCard["type"]) => {
        switch (type) {
            case "Visa":
                return "from-blue-500 to-blue-600";
            case "Mastercard":
                return "from-orange-500 to-red-500";
            case "Amex":
                return "from-green-500 to-teal-600";
            default:
                return "from-gray-500 to-gray-600";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Saved Cards</h2>
                        <p className="text-gray-600">Manage your payment methods securely</p>
                    </div>
                    <Button onClick={handleAddCard} className="bg-[#005000] hover:bg-[#006600]">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Card
                    </Button>
                </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <div className="shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Secure Payment</h4>
                    <p className="text-sm text-blue-700">
                        Your payment information is encrypted and securely stored. We never store
                        your full card number.
                    </p>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card) => (
                    <div key={card.id} className="relative">
                        {/* Card Visual */}
                        <div
                            className={`bg-gradient-to-br ${getCardColor(
                                card.type
                            )} rounded-2xl shadow-lg p-6 text-white mb-4 relative overflow-hidden`}
                        >
                            {/* Default Badge */}
                            {card.isDefault && (
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                                        <Star className="h-3 w-3 fill-current" />
                                        Default
                                    </span>
                                </div>
                            )}

                            {/* Card Pattern */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

                            {/* Card Content */}
                            <div className="relative">
                                <div className="mb-8">
                                    <CreditCard className="h-10 w-10" />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-white/70 text-xs mb-1">Card Number</p>
                                        <p className="text-xl font-bold tracking-wider">
                                            •••• •••• •••• {card.last4}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-white/70 text-xs mb-1">
                                                Card Holder
                                            </p>
                                            <p className="font-semibold">{card.holderName}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/70 text-xs mb-1">Expires</p>
                                            <p className="font-semibold">
                                                {card.expiryMonth}/{card.expiryYear}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Brand */}
                                <div className="absolute top-0 right-0">
                                    <p className="text-2xl font-bold">{card.type}</p>
                                </div>
                            </div>
                        </div>

                        {/* Card Actions */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <div className="flex gap-2">
                                {!card.isDefault && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSetDefault(card.id)}
                                        className="flex-1"
                                    >
                                        Set as Default
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditCard(card)}
                                    className={card.isDefault ? "flex-1" : ""}
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                                {!card.isDefault && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteCard(card.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {cards.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No saved payment methods
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Add a payment method for faster checkout
                    </p>
                    <Button onClick={handleAddCard} className="bg-[#005000] hover:bg-[#006600]">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Card
                    </Button>
                </div>
            )}

            {/* Card Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            {editingCard ? "Edit Card" : "Add New Card"}
                        </h3>

                        <form className="space-y-4">
                            <div>
                                <Label htmlFor="cardNumber">Card Number</Label>
                                <Input
                                    id="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="cardName">Cardholder Name</Label>
                                <Input
                                    id="cardName"
                                    placeholder="Cardholder Name"
                                    defaultValue={editingCard?.holderName || userName}
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input
                                        id="expiry"
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="cvv">CVV</Label>
                                    <div className="relative">
                                        <Input
                                            id="cvv"
                                            type={showCVV ? "text" : "password"}
                                            placeholder="123"
                                            maxLength={4}
                                            className="mt-1 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCVV(!showCVV)}
                                            className="absolute right-3 top-1/2 -translate-y-[calc(50%-2px)] text-gray-400 hover:text-gray-600 focus:outline-none"
                                        >
                                            {showCVV ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    className="flex-1 bg-[#005000] hover:bg-[#006600]"
                                >
                                    Save Card
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

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600">
                                🔒 Your card information is encrypted and secure. We use
                                industry-standard security measures to protect your data.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
