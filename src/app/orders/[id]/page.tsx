"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * Order detail lives under account. Redirect /orders/[id] -> /account/orders/[id].
 */
export default function OrderDetailRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    if (id) router.replace(`/account/orders/${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600 font-medium">Redirecting to order details...</p>
    </div>
  );
}
