"use client";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white">
            {/* Account Header */}
            <div className="bg-gradient-to-r from-lime-500 to-lime-600 text-white py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Account</h1>
                        <p className="text-lime-100">Manage your account and preferences</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Main Content */}
                <main>{children}</main>
            </div>
        </div>
    );
}
