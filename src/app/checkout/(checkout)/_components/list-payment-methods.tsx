"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect } from "react";
import { PaymentIcon, type PaymentType } from "react-svg-credit-card-payment-icons";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Radio, RadioField, RadioGroup } from "@/components/ui/radio";

import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";

type PaymentBrand =
  | "Visa"
  | "Mastercard"
  | "AmericanExpress"
  | "Amex"
  | "Discover"
  | "Diners"
  | "DinersClub"
  | "Jcb"
  | "JCB"
  | "Unionpay"
  | "UnionPay"
  | "Maestro"
  | "Alipay"
  | "Code"
  | "CodeFront"
  | "Elo"
  | "Generic"
  | "Hiper"
  | "Hipercard"
  | "Mir"
  | "PayPal"
  | "Paypal";

export default function PaymentMethodList({
  customerId,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}: {
  customerId: string | "";
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (value: string) => void;
}) {
  const router = useRouter();
  const customer = {
    invoice_settings: {
      default_payment_method: "pm_1",
    },
  };

  const paymentMethods = [
    {
      id: "pm_1",
      card: {
        brand: "visa",
        last4: "4242",
        exp_month: 12,
        exp_year: 2028,
      },
    },
    {
      id: "pm_2",
      card: {
        brand: "mastercard",
        last4: "4444",
        exp_month: 1,
        exp_year: 2023, // expired
      },
    },
  ];

  const isLoading = false;

  const defaultPaymentMethodId =
    customer?.invoice_settings?.default_payment_method;
  //
  // useEffect(() => {
  //   if (defaultPaymentMethodId) {
  //     setSelectedPaymentMethod(defaultPaymentMethodId);
  //   } else if (paymentMethods.length > 0) {
  //     setSelectedPaymentMethod(paymentMethods[0].id || "");
  //   }
  // }, [defaultPaymentMethodId, paymentMethods]);

  useEffect(() => {
    const isCardExpired = (expMonth: number, expYear: number): boolean => {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      return (
        expYear < currentYear ||
        (expYear === currentYear && expMonth < currentMonth)
      );
    };

    const getFirstValidCard = () =>
      paymentMethods.find(
        (pm) =>
          pm?.card?.exp_month &&
          pm?.card?.exp_year &&
          !isCardExpired(pm.card.exp_month, pm.card.exp_year),
      );

    const defaultMethod = paymentMethods.find(
      (pm) => pm.id === defaultPaymentMethodId,
    );
    const defaultIsExpired =
      defaultMethod?.card?.exp_month &&
      defaultMethod?.card?.exp_year &&
      isCardExpired(defaultMethod.card.exp_month, defaultMethod.card.exp_year);

    if (defaultMethod && defaultMethod.id && !defaultIsExpired) {
      setSelectedPaymentMethod(defaultMethod.id);
    } else {
      const validCard = getFirstValidCard();
      if (validCard && validCard.id) {
        setSelectedPaymentMethod(validCard.id);
      }
    }
  }, [defaultPaymentMethodId, paymentMethods]);

  const handlePaymentMethodChange = (value: string) => {
    const selectedPaymentMethod = paymentMethods?.find((pm) => pm.id == value);
    const expired =
      selectedPaymentMethod?.card?.exp_month &&
      selectedPaymentMethod?.card?.exp_year &&
      isCardExpired(
        selectedPaymentMethod?.card?.exp_month,
        selectedPaymentMethod?.card?.exp_year,
      );
    if (expired || !selectedPaymentMethod) return;
    setSelectedPaymentMethod(value);
  };

  const isCardExpired = (expMonth: number, expYear: number): boolean => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    return (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    );
  };

  useEffect(() => {
    if (!paymentMethods.length && !isLoading && customerId) {
      router.push("/checkouts/add-payment");
    }
  }, [paymentMethods?.length]);

  return (
    <>
      <div className="mt-6">
        <div className={"flex items-center justify-between"}>
          <Heading>Payment Methods</Heading>
          <div>
            <Link
              href={"/checkouts/add-payment"}
              className="text-cyan-600 hover:text-cyan-500 transform hover:translate-y-1 transition-transform duration-300 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add card
            </Link>
          </div>
        </div>
        <div className="mt-6">
          {isLoading && <PaymentMethodsSkeleton />}
          {paymentMethods && !isLoading && paymentMethods.length > 0 ? (
            <RadioGroup
              value={selectedPaymentMethod}
              onChange={handlePaymentMethodChange}
              className="space-y-6"
            >
              {paymentMethods?.map((pm) => {
                const expired =
                  pm?.card?.exp_month &&
                  pm?.card?.exp_year &&
                  isCardExpired(pm?.card?.exp_month, pm?.card?.exp_year);

                return (
                  <div
                    key={pm?.id}
                    onClick={() => {
                      if (!expired) {
                        handlePaymentMethodChange(pm?.id || "");
                      }
                    }}
                  >
                    <div
                      className={`sm:p-1 p-4 border rounded-lg transition-transform ${expired
                        ? "bg-red-50 border-red-200 opacity-60 cursor-not-allowed"
                        : "bg-gray-50 border-gray-200 hover:shadow-lg hover:scale-100"
                        } duration-300`}
                    >
                      <RadioField className="">
                        <div className="rounded-md  flex items-center pl-2 ">
                          <Radio
                            value={pm?.id || ""}
                            color="cyan"
                            disabled={!!expired}
                          />
                        </div>
                        <div className="p-2">
                          <div className="flex items-center">
                            <PaymentIcon
                              type={
                                (pm?.card?.brand as PaymentBrand) || "Generic"
                              }
                              className={"mr-4"}
                              width={40}
                              format={"flatRounded"}
                            />
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                Ending in {pm?.card?.last4}
                              </div>
                              <div className="mt-1 text-sm  text-gray-500">
                                Expires {pm?.card?.exp_month} /{" "}
                                {pm?.card?.exp_year}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <div className="-mt-8">
                              {defaultPaymentMethodId === pm?.id ? (
                                <span className="text-cyan-600 flex justify-end ">
                                  <CheckCircleIcon className="h-5 w-5" />
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </RadioField>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          ) : (
            <div className="text-sm dark:text-white text-gray-500">
              {!isLoading &&
                paymentMethods?.length === 0 &&
                "No Payment Methods"}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function PaymentMethodsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="h-20 bg-gray-100 border border-gray-200 rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  );
}
