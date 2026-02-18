"use client";

import React from "react";
import MembershipPlans from "@/components/membership-plans";
import PageHeader from "@/components/page-header";

export default function MembershipPage() {
    return (
        <main className="bg-white">
            <PageHeader
                title="JS Mart Membership"
                subtitle="Exclusive Rewards & Benefits"
                description="Join thousands of members enjoying free shipping and premium deals every day."
            />
            <div className="bg-gray-50/50">
                <MembershipPlans />
            </div>
        </main>
    );
}
