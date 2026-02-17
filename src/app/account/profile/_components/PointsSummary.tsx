"use client";

import { useState, useEffect } from "react";
import { Star, TrendingUp, History, Info } from "lucide-react";
import { userService, settingsService } from "@/services";

export function PointsSummary() {
    const [pointsData, setPointsData] = useState<any>(null);
    const [pointsRatio, setPointsRatio] = useState<number>(0.01);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [points, settings] = await Promise.all([
                    userService.getPoints(),
                    settingsService.getSettings()
                ]);

                setPointsData(points);

                const ratioSetting = settings.storeSettings.find(s => s.configKey === "POINTS_TO_AUD_RATIO");
                if (ratioSetting) {
                    setPointsRatio(parseFloat(ratioSetting.configValue));
                }
            } catch (error) {
                console.error("Failed to load points data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">My Loyalty Points</h2>

                <div className="grid grid-cols-1 gap-8 mb-12">
                    <div className="bg-gradient-to-br from-[#005000] to-[#006600] rounded-2xl p-8 text-white max-w-md">
                        <div className="flex items-center gap-3 mb-4 opacity-80">
                            <Star className="h-5 w-5 fill-white" />
                            <span className="text-sm font-bold uppercase tracking-wider">Available Points</span>
                        </div>
                        <div className="text-5xl font-extrabold mb-4">
                            {loading ? "..." : pointsData?.totalPoints || 0}
                        </div>
                        <div className="text-green-100 text-sm">
                            Equivalent to <span className="font-bold">AUD {((pointsData?.totalPoints || 0) * pointsRatio).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <div className="flex items-center gap-2 mb-6 text-gray-900">
                        <History className="h-5 w-5" />
                        <span className="font-bold">Recent Points History</span>
                    </div>

                    <div className="text-center py-12 text-gray-400">
                        <Info className="h-8 w-8 mx-auto mb-3 opacity-30" />
                        <p>No recent points activity found</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
