"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorMessage, Field } from "@/components/ui/fieldset";
import { Heading } from "@/components/ui/heading";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const OrderSummary = ({
  shippingPrice,
}: {
  shippingPrice: number;
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isApply, setIsApply] = useState(false);

  const [subTotal, setSubTotal] = useState(0);

  //Load cart from localStorage
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Calculate subtotal when cart changes
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubTotal(total);
  }, [cartItems]);

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setFormErrors({ code: "Enter discount code" });
      return;
    }

    setFormErrors({});
    setIsApply(true);

    // ⚠️ fake discount logic (frontend only)
    if (discountCode === "SAVE10") {
      alert("Discount applied (10%)");
    } else {
      setFormErrors({ code: "Invalid discount code" });
    }

    setIsApply(false);
  };

  const total = subTotal + shippingPrice;



  return (
    <div className="lg:mt-0">
      <div className="rounded-md border border-gray-200 bg-white shadow-xs">

        <Heading className="p-4">Order summary</Heading>

        {/* ITEMS */}
        <ul role="list" className="divide-y divide-gray-200">
          {cartItems.map(item => (
            <li key={item.id} className="flex px-4 py-4 sm:px-6">
              <div className="relative shrink-0">
                <div className="size-24 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <p className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                  {item.quantity}
                </p>
              </div>

              <div className="ml-6 flex flex-1 flex-col">
                <h4 className="text-sm font-medium text-gray-900">
                  {item.name}
                </h4>
              </div>
            </li>
          ))}
        </ul>

        {/* DISCOUNT */}
        <div className="p-2 sm:px-6 flex gap-2">
          <Field className="flex-1">
            <Input
              name="discount_code"
              placeholder="Discount code or gift card"
              value={discountCode}
              onChange={e => setDiscountCode(e.target.value)}
              invalid={!!formErrors?.code}
            />
            {formErrors.code && (
              <ErrorMessage>{formErrors.code}</ErrorMessage>
            )}
          </Field>

          <Button
            type="button"
            color="cyan"
            onClick={handleApplyDiscount}
          >
            Apply
          </Button>
        </div>

        {/* TOTALS */}
        <dl className="mt-4 space-y-4 border-t px-4 py-6 bg-gray-50">

          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="font-medium">
              AUD {subTotal.toFixed(2)}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd className="font-medium">
              AUD {shippingPrice.toFixed(2)}
            </dd>
          </div>

          <div className="flex justify-between border-t pt-4">
            <dt className="text-base font-semibold">Total</dt>
            <dd className="text-base font-semibold">
              AUD {total.toFixed(2)}
            </dd>
          </div>

        </dl>
      </div>
    </div>
  );
};

export default OrderSummary;
