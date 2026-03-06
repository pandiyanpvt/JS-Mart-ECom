"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, Ticket, Gift, ArrowRight } from "lucide-react";

interface PromoStatsStripProps {
    activeOffersCount?: number;
    dealsCount?: number;
    redemptionsLabel?: string;
}

export default function PromoStatsStrip({
    activeOffersCount = 0,
    dealsCount = 0,
    redemptionsLabel = "Save More",
}: PromoStatsStripProps) {
    const stats = [
        {
            label: "Today's Deals",
            value: dealsCount > 0 ? dealsCount : "—",
            sub: "Active offers",
            icon: TrendingUp,
            href: "/offers",
        },
        {
            label: "Active Coupons",
            value: activeOffersCount,
            sub: "Use at checkout",
            icon: Ticket,
            href: "/offers",
        },
        {
            label: "Redemptions",
            value: redemptionsLabel,
            sub: "Customers saving",
            icon: Gift,
            href: "/shop",
        },
    ];

    return null;
}
