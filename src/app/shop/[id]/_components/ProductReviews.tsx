"use client";

import { useState, useEffect } from "react";
import { Star, User as UserIcon, MessageSquare } from "lucide-react";
import { reviewService } from "@/services";
import { type UserReview } from "@/services/review.service";

interface ProductReviewsProps {
    productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<UserReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;

        reviewService.getProductReviews(productId)
            .then(data => setReviews(data))
            .catch(err => console.error("Failed to fetch product reviews:", err))
            .finally(() => setLoading(false));
    }, [productId]);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#253D4E] flex items-center gap-3">
                        Customer Reviews
                        <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            {reviews.length} total
                        </span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">What our customers say about this product</p>
                </div>

                {reviews.length > 0 && (
                    <div className="flex items-center gap-4 bg-green-50/50 px-6 py-4 rounded-2xl border border-green-100">
                        <div className="text-center">
                            <p className="text-3xl font-black text-[#005000] leading-none mb-1">{averageRating}</p>
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        className={`w-3 h-3 ${Number(averageRating) >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="h-10 w-px bg-green-200/50 mx-2" />
                        <div>
                            <p className="text-sm font-bold text-[#253D4E]">Average Rating</p>
                            <p className="text-xs text-green-700 font-medium">Based on {reviews.length} verified reviews</p>
                        </div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005000]"></div>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <MessageSquare className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium text-lg">No reviews yet</p>
                    <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">Be the first to review this product after you make a purchase!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-green-100 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden group-hover:border-green-100 transition-colors">
                                        {review.user?.profileImg ? (
                                            <img src={review.user.profileImg} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <UserIcon className="h-6 w-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#253D4E] line-clamp-1">{review.user?.fullName || "Verified Buyer"}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                                            <p>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}</p>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                            <p className="text-green-600">Verified Purchase</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-100">
                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-black text-yellow-700">{review.rating}</span>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed italic line-clamp-3">
                                "{review.comment}"
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
