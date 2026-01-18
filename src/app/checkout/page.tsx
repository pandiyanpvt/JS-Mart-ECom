"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutRootPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/checkout/address"); // redirect to address
    }, [router]);

    return null;
}
