"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import OrderSummary from "./(checkout)/_components/order-summary";
import ShippingAddressList from "./(checkout)/_components/list-shipping-address";

// Simulated components




type ShippingMethodType = "standard" | "express";

export default function CheckoutPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [address, setAddress] = useState<any>({
    name: "",
    street_address: "",
    province: "",
    district: "",
    postal_code: "",
  });
  const [selectedShippingMethod, setSelectedShippingMethod] =
      useState<ShippingMethodType>("standard");

  const [shippingPrice, setShippingPrice] = useState({
    standard: 5,
    express: 10,
  });

  // Load cart items from localStorage
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) setCartItems(JSON.parse(storedCartItems));
  }, []);

  const handleClickContinue = () => {
    if (
        address.name &&
        address.street_address &&
        address.province &&
        address.district &&
        address.postal_code
    ) {
      setStep(2);
    } else {
      alert("Please fill in all address fields.");
    }
  };

  const handleConfirmOrder = () => {
    // Simulate checkout
    console.log("Order confirmed:", { cartItems, address, selectedShippingMethod });
    // Clear cart
    localStorage.removeItem("cartItems");
    alert("Order placed successfully!");
    router.push("/orders");
  };

  return (
      <div className="bg-white min-h-screen">
        <div className="px-4 py-8 max-w-4xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div>
              {step === 1 && (
                  <>
                    <ShippingAddressList address={address} setAddress={setAddress} />

                  </>
              )}
              {step === 2 && (
                  <div className="p-4 border rounded-md bg-gray-50">
                    <h3 className="font-semibold mb-2">Review</h3>
                    <p>
                      <strong>Ship to:</strong> {address.name},{" "}
                      {address.street_address}, {address.province}, {address.district},{" "}
                      {address.postal_code}
                    </p>
                    <p>
                      <strong>Shipping Method:</strong> {selectedShippingMethod} ($
                      {shippingPrice[selectedShippingMethod]})
                    </p>
                  </div>
              )}
            </div>

            <div className="mt-8 lg:mt-0">
              <OrderSummary
                  shippingPrice={shippingPrice[selectedShippingMethod]}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            {step === 2 && (
                <button
                    className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-500"
                    onClick={() => setStep(1)}
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Return to address
                </button>
            )}
            {step === 1 ? (
                <Button color="cyan" onClick={handleClickContinue}>
                  Continue to pay
                </Button>
            ) : (
                <Button color="cyan" onClick={handleConfirmOrder}>
                  Confirm order
                </Button>
            )}
          </div>
        </div>
      </div>
  );
}
