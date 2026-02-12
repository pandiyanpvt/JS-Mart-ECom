"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Orders list lives under account. Redirect /orders -> /account/orders.
 */
export default function OrdersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account/orders");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600 font-medium">Redirecting to your orders...</p>
    </div>
  );
}
