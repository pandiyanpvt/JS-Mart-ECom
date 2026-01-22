"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaymentPage() {
    const router = useRouter();

    const handlePayment = () => {
        // here you would integrate Stripe / PayPal etc.
        const success = true; // simulate success/failure
        if (success) router.push("/order-success");
        else router.push("/order-failed");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Payment</h1>
            <div className="space-y-4 max-w-md">
                <p>Select your payment method (simulated)</p>
                <Button onClick={handlePayment}>Pay Now</Button>
            </div>
        </div>
    );
}
