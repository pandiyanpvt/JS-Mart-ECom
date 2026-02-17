"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Star, Info } from "lucide-react";
import { reviewService } from "@/services";

export function ReviewList() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        reviewService.getMyReviews()
            .then(data => setReviews(Array.isArray(data) ? data : []))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">My Reviews</h2>

                {loading ? (
                    <p className="text-center py-8 text-gray-500">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">You haven't written any reviews yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${review.is_approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {review.is_approved ? 'Approved' : 'Pending Approval'}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-900 text-sm mb-1">{review.product?.productName || `Product ID: ${review.productId}`}</h4>
                                <p className="text-gray-800 italic mb-4 text-sm">"{review.comment}"</p>
                                <div className="flex items-center justify-between text-[10px] text-gray-500">
                                    <span>Date: {new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
