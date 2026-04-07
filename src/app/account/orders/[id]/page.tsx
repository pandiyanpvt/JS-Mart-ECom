"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
    Package,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle,
    Clock,
    ChevronLeft,
    Download,
    AlertTriangle,
    Wallet,
    Banknote,
    X,
    Loader2,
    User,
    RotateCcw,
    Star
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import orderService from "@/services/order.service";
import toast from "react-hot-toast";
import { useModal } from "@/components/providers/ModalProvider";
import { cn } from "@/lib/utils";
import { refundService, settingsService, reviewService } from "@/services";
import type { Refund } from "@/services/refund.service";
import type { UserReview } from "@/services/review.service";
import { resolveImageSrc } from "@/lib/images";

export default function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const id = params.id;
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [submittingCancel, setSubmittingCancel] = useState(false);
    const [refundMethod, setRefundMethod] = useState<"BANK" | "POINTS" | null>(null);
    const [refundDays, setRefundDays] = useState<number | null>(null);
    const [itemRefundModalOpen, setItemRefundModalOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
    const [itemRefundQuantity, setItemRefundQuantity] = useState(1);
    const [itemMaxQuantity, setItemMaxQuantity] = useState(1);
    const [isOfferBundle, setIsOfferBundle] = useState(false);
    const [itemRefundReason, setItemRefundReason] = useState("");
    const [itemRefundMethod, setItemRefundMethod] = useState<"BANK" | "POINTS" | null>(null);
    const [itemRefundEvidence, setItemRefundEvidence] = useState<File | null>(null);
    const [submittingItemRefund, setSubmittingItemRefund] = useState(false);
    const [myRefunds, setMyRefunds] = useState<any[]>([]);

    // Review states
    const [myReviews, setMyReviews] = useState<UserReview[]>([]);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const data = await orderService.getOrderById(id);
            setOrder(data);
        } catch (error) {
            console.error("Failed to fetch order:", error);
            toast.error("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            if (!id) return;
            await fetchOrder();
            try {
                const [settings, refunds, reviews] = await Promise.all([
                    settingsService.getSettings().catch(() => null),
                    refundService.getMyRefunds().catch(() => [] as Refund[]),
                    reviewService.getMyReviews().catch(() => [] as UserReview[])
                ]);

                if (settings?.storeSettings) {
                    const refundSetting = settings.storeSettings.find(
                        (s) => s.configKey === "REFUND_DAYS"
                    );
                    if (refundSetting) {
                        const days = parseInt(refundSetting.configValue, 10);
                        if (!Number.isNaN(days)) {
                            setRefundDays(days);
                        }
                    }
                }

                if (Array.isArray(refunds)) {
                    setMyRefunds(refunds);
                }

                if (Array.isArray(reviews)) {
                    setMyReviews(reviews);
                }
            } catch (e) {
                console.error("Failed to load refund helpers", e);
            }
        };

        load();
    }, [id]);

    const { showModal } = useModal();

    const handleCancelOrder = () => {
        if (order.isPaid) {
            setShowRefundModal(true);
            return;
        }

        showModal({
            title: "Cancel Order",
            message: "Are you sure you want to cancel this order? This action cannot be undone and your items will be returned to stock.",
            type: "warning",
            confirmLabel: "Yes, Cancel",
            cancelLabel: "No, Keep Order",
            onConfirm: async () => {
                try {
                    await orderService.updateOrder(id, { status: 'CANCELLED' });
                    toast.success("Order cancelled successfully");
                    await fetchOrder();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Failed to cancel order");
                    throw error;
                }
            }
        });
    };

    const processCancellationWithRefund = async () => {
        if (!refundMethod) {
            toast.error("Please select a refund method");
            return;
        }

        setSubmittingCancel(true);
        try {
            await orderService.updateOrder(id, {
                status: 'CANCELLED',
                refundMethod: refundMethod,
                refundReason: "Order cancelled by customer"
            });
            toast.success("Order cancelled and refund request created");
            setShowRefundModal(false);
            await fetchOrder();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setSubmittingCancel(false);
        }
    };

    const handleCompleteOrder = () => {
        showModal({
            title: "Complete Order",
            message: "Have you received all items in good condition? Marking as completed will finalize this order in our system.",
            type: "info",
            confirmLabel: "Yes, Complete",
            cancelLabel: "Not Yet",
            onConfirm: async () => {
                try {
                    await orderService.updateOrder(id, { status: 'COMPLETED' });
                    toast.success("Order marked as completed");
                    await fetchOrder();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Failed to complete order");
                    throw error;
                }
            }
        });
    };

    const openItemRefundModal = (detail: any) => {
        setSelectedDetail(detail);

        let maxQty = Number(detail.quantity || 1);
        let offerBundle = false;

        // If item is part of an offer, require returning full bundle (paid + free items)
        if (detail.offerId && Array.isArray(order?.details)) {
            const bundleQty = order.details
                .filter((d: any) => d.offerId === detail.offerId)
                .reduce((sum: number, d: any) => sum + (Number(d.quantity) || 0), 0);

            if (bundleQty > 0) {
                maxQty = bundleQty;
                offerBundle = true;
            }
        }

        setItemMaxQuantity(maxQty);
        setItemRefundQuantity(maxQty);
        setIsOfferBundle(offerBundle);
        setItemRefundReason("");
        const paymentTypeName = (order?.paymentType?.type || "").toLowerCase();
        if (paymentTypeName.includes("cash on delivery") || paymentTypeName.includes("cod")) {
            setItemRefundMethod("POINTS");
        } else {
            setItemRefundMethod(null);
        }
        setItemRefundModalOpen(true);
    };

    const closeItemRefundModal = () => {
        if (submittingItemRefund) return;
        setItemRefundModalOpen(false);
        setSelectedDetail(null);
    };

    const hasActiveRefundForDetail = (detail: any) => {
        if (!order) return false;
        return myRefunds.some(
            (r) =>
                r.orderId === order.id &&
                r.productId === detail.productId &&
                r.status !== "REJECTED"
        );
    };

    const getRefundStatusForDetail = (detail: any) => {
        if (!order) return null;
        const match = myRefunds.find(
            (r) => r.orderId === order.id && r.productId === detail.productId
        );
        return match?.status || null;
    };

    const submitItemRefund = async () => {
        if (!order || !selectedDetail) return;

        if (!itemRefundMethod) {
            toast.error("Please select a refund method");
            return;
        }

        if (!itemRefundReason.trim()) {
            toast.error("Please provide a reason");
            return;
        }

        if (!itemRefundEvidence) {
            toast.error("Please upload an image as evidence for the return");
            return;
        }

        if (itemRefundQuantity < 1 || itemRefundQuantity > itemMaxQuantity) {
            toast.error("Invalid quantity selected");
            return;
        }

        setSubmittingItemRefund(true);
        try {
            const formData = new FormData();
            formData.append("orderId", order.id.toString());
            formData.append("productId", selectedDetail.productId.toString());
            formData.append("quantity", itemRefundQuantity.toString());
            formData.append("reason", itemRefundReason.trim());
            formData.append("refundMethod", itemRefundMethod);
            formData.append("evidence", itemRefundEvidence);

            await refundService.requestRefund(formData);
            toast.success("Return / refund request submitted");

            // Refresh order and refunds
            await fetchOrder();
            const refunds = await refundService.getMyRefunds().catch(() => [] as any[]);
            if (Array.isArray(refunds)) {
                setMyRefunds(refunds);
            }
            closeItemRefundModal();
            setItemRefundEvidence(null);
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to submit refund request";
            toast.error(message);
        } finally {
            setSubmittingItemRefund(false);
        }
    };

    const hasReviewed = (productId: number) => {
        return myReviews.some(
            (r) => r.orderId === order?.id && r.productId === productId
        );
    };

    const openReviewModal = (detail: any) => {
        setSelectedDetail(detail);
        setReviewRating(5);
        setReviewComment("");
        setReviewModalOpen(true);
    };

    const closeReviewModal = () => {
        if (submittingReview) return;
        setReviewModalOpen(false);
        setSelectedDetail(null);
    };

    const submitReview = async () => {
        if (!order || !selectedDetail) return;

        if (reviewRating < 1 || reviewRating > 5) {
            toast.error("Please provide a valid rating");
            return;
        }

        setSubmittingReview(true);
        try {
            await reviewService.createReview({
                orderId: order.id,
                productId: selectedDetail.productId,
                rating: reviewRating,
                comment: reviewComment.trim()
            });
            toast.success("Review submitted successfully");

            // Refresh reviews
            const reviews = await reviewService.getMyReviews().catch(() => [] as UserReview[]);
            if (Array.isArray(reviews)) {
                setMyReviews(reviews);
            }
            closeReviewModal();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-0 flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005000]"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen pt-0 flex flex-col justify-center items-center bg-gray-50 gap-4">
                <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
                <Button onClick={() => router.push('/account/orders')} className="bg-[#00028C]">
                    Back to Orders
                </Button>
            </div>
        );
    }

    // Helper to determine step completion based on status
    const getSteps = (currentStatus: string) => {
        const orderStatus = currentStatus.toUpperCase();
        if (orderStatus === 'CANCELLED') {
            return [
                { status: 'Order Placed', completed: true, date: new Date(order.createdAt).toLocaleDateString(), color: 'emerald' },
                { status: 'Cancelled', completed: true, date: new Date(order.updatedAt).toLocaleDateString(), isCancelled: true, color: 'rose' }
            ];
        }

        const statusOrder = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        const colors = ['amber', 'blue', 'indigo', 'emerald'];

        const currentIndex = orderStatus === 'COMPLETED' ? 3 : statusOrder.indexOf(orderStatus);

        return statusOrder.map((status, index) => ({
            status: status.charAt(0) + status.slice(1).toLowerCase(), // Capitalize
            completed: index <= currentIndex,
            date: index === currentIndex ? new Date(order.updatedAt).toLocaleDateString() : '',
            isCancelled: false,
            color: colors[index]
        }));
    };

    const trackingSteps = getSteps(order.status || 'PENDING');

    return (
        <div className="min-h-screen bg-gray-50 pt-0 pb-12">
            <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Back to Orders
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Order #{order.id}
                                </h2>
                                {order.status && (
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border transition-all",
                                        order.status.toUpperCase() === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            order.status.toUpperCase() === 'PROCESSING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                order.status.toUpperCase() === 'SHIPPED' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    order.status.toUpperCase() === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        order.status.toUpperCase() === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200 shadow-sm shadow-green-100' :
                                                            order.status.toUpperCase() === 'CANCELLED' || order.status.toUpperCase() === 'RETURNED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                                order.status.toUpperCase() === 'RETURN_REQUESTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                                    'bg-gray-50 text-gray-500 border-gray-100'
                                    )}>
                                        {order.status}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600">
                                Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.details?.length || 0} items
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {order.status === 'PENDING' && (
                                <Button
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={handleCancelOrder}
                                >
                                    Cancel Order
                                </Button>
                            )}
                            {order.status === 'DELIVERED' && (
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                    onClick={handleCompleteOrder}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Complete Order
                                </Button>
                            )}
                            {!['CANCELLED', 'COMPLETED'].includes(order.status?.toUpperCase()) && (
                                <Button className="bg-[#00028C] hover:bg-[#00026e]">
                                    <Truck className="h-4 w-4 mr-2" />
                                    Track Order
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Tracking */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Order Tracking</h3>

                    <div className="relative">
                        <div className="flex flex-col md:flex-row justify-between w-full">
                            {trackingSteps.map((step, index) => (
                                <div key={index} className="flex flex-1 flex-col items-center relative">
                                    {/* Line connecting steps - hidden on last item */}
                                    {index < trackingSteps.length - 1 && (
                                        <div className={cn(
                                            "hidden md:block absolute top-[20px] left-[50%] right-[-50%] h-1 bg-gray-100 z-0",
                                            step.completed && trackingSteps[index + 1].completed ? (
                                                step.color === 'emerald' ? 'bg-emerald-500' :
                                                    step.color === 'indigo' ? 'bg-indigo-500' :
                                                        step.color === 'blue' ? 'bg-blue-500' :
                                                            'bg-amber-500'
                                            ) : 'bg-gray-100'
                                        )} />
                                    )}

                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 border-2 shadow-sm",
                                        step.completed ? (
                                            step.color === 'emerald' ? 'bg-emerald-500 text-white border-emerald-200' :
                                                step.color === 'indigo' ? 'bg-indigo-500 text-white border-indigo-200' :
                                                    step.color === 'blue' ? 'bg-blue-500 text-white border-blue-200' :
                                                        step.color === 'rose' ? 'bg-rose-500 text-white border-rose-200' :
                                                            'bg-amber-500 text-white border-amber-200'
                                        ) : 'bg-white text-gray-300 border-gray-100'
                                    )}>
                                        {step.completed ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                    </div>
                                    <p className={cn(
                                        "mt-3 text-[10px] font-black uppercase tracking-widest transition-all",
                                        step.completed ? 'text-gray-900' : 'text-gray-300'
                                    )}>
                                        {step.status}
                                    </p>
                                    {step.date && <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter opacity-70">{step.date}</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {order.status?.toUpperCase() === 'SHIPPED' && order.deliveryOtp && (
                        <div className="mt-12 p-6 bg-green-50 rounded-2xl border border-green-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#005000] rounded-xl flex items-center justify-center text-white shrink-0">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Delivery Verification Code</h4>
                                    <p className="text-sm text-gray-600">Share this OTP with our delivery partner once they arrive at your door.</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:items-end">
                                <span className="text-3xl font-black text-[#005000] tracking-[0.2em] bg-white px-6 py-2 rounded-xl border-2 border-green-200 shadow-sm">
                                    {order.deliveryOtp}
                                </span>
                                <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">Confidential Code</p>
                            </div>
                        </div>
                    )}

                    {order.deliveryAgent && (order.status?.toUpperCase() === 'SHIPPED' || order.status?.toUpperCase() === 'DELIVERED') && (
                        <div className={cn(
                            "mt-6 p-6 rounded-2xl border flex items-center gap-5 transition-all animate-in fade-in slide-in-from-top-4 duration-1000",
                            "bg-indigo-50/30 border-indigo-100 shadow-sm"
                        )}>
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
                                <User className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-1 opacity-50">Delivery Partner</h4>
                                <p className="text-lg font-bold text-indigo-900">
                                    {order.deliveryAgent.fullName} <span className="text-indigo-600 font-medium">is assigned to your delivery.</span>
                                </p>
                                <p className="text-xs text-indigo-500 font-medium mt-0.5 opacity-80">Our partner will reach out to you if needed.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Return Tracking Section */}
                {myRefunds.filter(r => r.orderId === order.id).length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-8 mb-6 border-l-4 border-emerald-500">
                        <div className="flex items-center gap-3 mb-6">
                            <RotateCcw className="h-6 w-6 text-emerald-600" />
                            <h3 className="text-xl font-bold text-gray-900">Return & Refund Tracking</h3>
                        </div>

                        <div className="space-y-8">
                            {myRefunds
                                .filter(r => r.orderId === order.id)
                                .map((refund) => (
                                    <div key={refund.id} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 font-bold">
                                                    #{refund.id}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">
                                                        {refund.product?.productName || "Product Refund"}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        Qty: {refund.quantity} • Amount: AUD {Number(refund.refundAmount).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                refund.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    refund.status === 'APPROVED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        refund.status === 'COLLECTED' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                            refund.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                refund.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                                    'bg-gray-50 text-gray-500 border-gray-100'
                                            )}>
                                                {refund.status}
                                            </span>
                                        </div>

                                        {refund.status === 'PICKUP_ASSIGNED' && refund.pickupOtp && (
                                            <div className="mb-6 p-5 bg-amber-50 rounded-[2rem] border border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in zoom-in-95 duration-500">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-200">
                                                        <RotateCcw className="w-6 h-6 animate-pulse" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-amber-900 uppercase tracking-widest text-[10px] mb-1">Return Pickup Code</h4>
                                                        <p className="text-sm font-bold text-amber-800 leading-tight">Verify this code with the pickup agent</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white px-8 py-3 rounded-2xl border-2 border-amber-200 shadow-sm flex flex-col items-center">
                                                    <span className="text-3xl font-black text-amber-600 tracking-[0.3em]">
                                                        {refund.pickupOtp}
                                                    </span>
                                                    <p className="text-[9px] font-black text-amber-400 mt-1 uppercase tracking-widest">Confidential</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="relative pl-6 border-l-2 border-gray-100 ml-5 space-y-6">
                                            {refund.tracking?.map((track: any, idx: number) => (
                                                <div key={track.id} className="relative">
                                                    <div className={cn(
                                                        "absolute -left-[35px] top-0 w-4 h-4 rounded-full border-2 bg-white",
                                                        idx === 0 ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
                                                    )} />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900">{track.status}</span>
                                                        {track.note && <p className="text-xs text-gray-600 mt-1">{track.note}</p>}
                                                        <span className="text-[10px] text-gray-400 mt-1">
                                                            {new Date(track.dateTime || track.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Order Items */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Order Items</h3>

                    <div className="space-y-4">
                        {order.details?.map((detail: any) => {
                            const product = detail.Product || detail.product;
                            const primaryImage = product?.images?.find((img: any) => img.isPrimary) || product?.images?.[0];
                            const imgRaw = primaryImage?.productImg || product?.productImage || product?.image;
                            const imgSrc = resolveImageSrc(imgRaw);

                            const refundStatus = getRefundStatusForDetail(detail);
                            const isFreeItem = Number(detail.pricePerUnit || 0) <= 0;
                            const isReturnable = product?.isReturnable === true || product?.isReturnable === 1 || product?.isReturnable === '1';
                            const disableReturn =
                                order.status?.toUpperCase() !== "COMPLETED" ||
                                hasActiveRefundForDetail(detail) ||
                                isFreeItem ||
                                !isReturnable;

                            return (
                                <div
                                    key={detail.id}
                                    className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#005000] transition-colors"
                                >
                                    <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                                        <img
                                            src={imgSrc}
                                            alt={product?.productName || "Product"}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{product?.productName || 'Product'}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Quantity: {detail.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">
                                            AUD {(Number(detail.pricePerUnit || 0) * detail.quantity).toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-600">AUD {Number(detail.pricePerUnit || 0).toFixed(2)} each</p>
                                        {refundStatus ? (
                                            <p className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 inline-flex px-2 py-1 rounded-full border border-emerald-100">
                                                <RotateCcw className="w-3 h-3 mr-1" />
                                                Refund: {refundStatus}
                                            </p>
                                        ) : (
                                            <>
                                                {order.status?.toUpperCase() === "COMPLETED" && !hasReviewed(detail.productId) && (
                                                    <button
                                                        onClick={() => openReviewModal(detail)}
                                                        className="mt-2 inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors border-indigo-600 text-indigo-700 hover:bg-indigo-50 mr-2"
                                                    >
                                                        <Star className="w-3 h-3 mr-1" />
                                                        Review Product
                                                    </button>
                                                )}
                                                {hasReviewed(detail.productId) && (
                                                    <p className="mt-2 text-xs font-semibold text-indigo-700 bg-indigo-50 inline-flex px-2 py-1 rounded-full border border-indigo-100 mr-2">
                                                        <Star className="w-3 h-3 mr-1 fill-indigo-700 text-indigo-700" />
                                                        Reviewed
                                                    </p>
                                                )}
                                                <button
                                                    disabled={disableReturn}
                                                    onClick={() => openItemRefundModal(detail)}
                                                    className="mt-2 inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                                                >
                                                    <RotateCcw className="w-3 h-3 mr-1" />
                                                    {!isReturnable ? "Non-returnable" : "Request Return"}
                                                </button>
                                                {isFreeItem && (
                                                    <p className="mt-1 text-[11px] text-gray-500">
                                                        Free items from offers must be returned together with the paid item.
                                                    </p>
                                                )}
                                                {!isReturnable && (
                                                    <p className="mt-1 text-[11px] text-rose-500 font-medium">
                                                        This item cannot be returned.
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Discount Breakdown */}
                        {order.discountLogs && order.discountLogs.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-bold text-gray-900 mb-4">Discount Breakdown</h4>
                                <div className="space-y-2">
                                    {order.discountLogs.map((log: any) => (
                                        <div key={log.id} className="flex justify-between items-center text-sm p-3 bg-green-50 rounded border border-green-100">
                                            <span className="font-medium text-[#005000]">{log.description}</span>
                                            <span className="font-bold text-[#005000]">- AUD {Number(log.amount).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-3 max-w-md ml-auto">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>AUD {Number(order.subtotal || 0).toFixed(2)}</span>
                            </div>

                            {Number(order.discount) > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Offers Discount</span>
                                    <span className="text-red-500">- AUD {Number(order.discount).toFixed(2)}</span>
                                </div>
                            )}

                            {Number(order.couponDiscount) > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Coupon Discount</span>
                                    <span className="text-red-500">- AUD {Number(order.couponDiscount).toFixed(2)}</span>
                                </div>
                            )}

                            {Number(order.pointsDiscount) > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Points Discount</span>
                                    <span className="text-red-500">- AUD {Number(order.pointsDiscount).toFixed(2)}</span>
                                </div>
                            )}

                            {Number(order.shippingCost) > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>AUD {Number(order.shippingCost).toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                                <span>Total</span>
                                <span className="text-[#005000]">AUD {Number(order.totalAmount || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <MapPin className="h-6 w-6 text-[#005000]" />
                            <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
                        </div>
                        {order.shippingAddress ? (
                            <div className="text-gray-600 space-y-1">
                                <p className="font-semibold text-gray-900">{order.shippingAddress.addressLine1 || 'Address'}</p>
                                {order.shippingAddress.addressLine2 && (
                                    <p>{order.shippingAddress.addressLine2}</p>
                                )}
                                <p>
                                    {order.shippingAddress.city || ''}{order.shippingAddress.city && order.shippingAddress.state ? ', ' : ''}
                                    {order.shippingAddress.state || ''}
                                    {order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ''}
                                </p>
                                {order.shippingAddress.country && (
                                    <p>{order.shippingAddress.country}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">No shipping address details available.</p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="h-6 w-6 text-[#005000]" />
                            <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
                        </div>
                        <div className="text-gray-600">
                            <p className="font-semibold text-gray-900">
                                {order.paymentType?.type || 'Standard Payment'}
                            </p>
                            <p className="text-sm mt-2">
                                <span className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium border border-green-200">
                                    {order.isPaid ? 'Payment Successful' : 'Payment Pending'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Selection Modal (for cancelling paid PENDING orders) */}
            <Transition.Root show={showRefundModal} as={Fragment}>
                <Dialog as="div" className="relative z-[9999]" onClose={() => !submittingCancel && setShowRefundModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 scale-95"
                                enterTo="opacity-100 translate-y-0 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 scale-100"
                                leaveTo="opacity-0 translate-y-4 scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-[2rem] bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-[#005000] px-6 py-8 text-center text-white relative">
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                            <AlertTriangle className="h-8 w-8 text-white" />
                                        </div>
                                        <Dialog.Title as="h3" className="text-2xl font-bold">
                                            Cancel Paid Order
                                        </Dialog.Title>
                                        <p className="mt-2 text-green-100 text-sm">
                                            Your money will be refunded. Please select your preferred refund method.
                                        </p>
                                    </div>

                                    <div className="bg-white px-8 pt-8 pb-4">
                                        <div className="space-y-4">
                                            <button
                                                onClick={() => setRefundMethod("POINTS")}
                                                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${refundMethod === "POINTS"
                                                    ? "border-[#005000] bg-green-50 shadow-md"
                                                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${refundMethod === "POINTS" ? "bg-[#005000] text-white" : "bg-gray-100 text-gray-500"
                                                    }`}>
                                                    <Wallet className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-900">Refund to JS Mart Points</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Instant refund. Use for future purchases.</p>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${refundMethod === "POINTS" ? "border-[#005000]" : "border-gray-200"
                                                    }`}>
                                                    {refundMethod === "POINTS" && <div className="w-3 h-3 rounded-full bg-[#005000]" />}
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => setRefundMethod("BANK")}
                                                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${refundMethod === "BANK"
                                                    ? "border-[#005000] bg-green-50 shadow-md"
                                                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${refundMethod === "BANK" ? "bg-[#005000] text-white" : "bg-gray-100 text-gray-500"
                                                    }`}>
                                                    <Banknote className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-900">Original Payment Method</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Takes 3-5 business days to process.</p>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${refundMethod === "BANK" ? "border-[#005000]" : "border-gray-200"
                                                    }`}>
                                                    {refundMethod === "BANK" && <div className="w-3 h-3 rounded-full bg-[#005000]" />}
                                                </div>
                                            </button>
                                        </div>

                                        <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed italic">
                                            * All refunds are reviewed and approved by our team within 24 hours. Items will be returned to stock immediately.
                                        </p>
                                    </div>

                                    <div className="bg-gray-50/50 px-8 py-6 flex flex-col gap-3">
                                        <Button
                                            onClick={processCancellationWithRefund}
                                            disabled={!refundMethod || submittingCancel}
                                            className="w-full bg-[#005000] hover:bg-[#003d00] h-12 font-bold rounded-xl shadow-lg shadow-green-900/10 active:scale-[0.98] transition-all"
                                        >
                                            {submittingCancel ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                    Processing...
                                                </>
                                            ) : (
                                                "Confirm Cancellation"
                                            )}
                                        </Button>
                                        <button
                                            onClick={() => !submittingCancel && setShowRefundModal(false)}
                                            className="w-full py-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            Nevermind, keep order
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            {/* Per-item Return / Refund Modal */}
            <Transition.Root show={itemRefundModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[9999]" onClose={closeItemRefundModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 scale-95"
                                enterTo="opacity-100 translate-y-0 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 scale-100"
                                leaveTo="opacity-0 translate-y-4 scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-[2rem] bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-[#005000] px-6 py-8 text-center text-white relative">
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                            <RotateCcw className="h-8 w-8 text-white" />
                                        </div>
                                        <Dialog.Title as="h3" className="text-2xl font-bold">
                                            Request a Return
                                        </Dialog.Title>
                                        <p className="mt-2 text-green-100 text-sm">
                                            {refundDays
                                                ? `You can request a return within ${refundDays} day${refundDays > 1 ? "s" : ""} after delivery, subject to approval.`
                                                : "Return requests are allowed for a limited time after delivery, subject to approval."}
                                        </p>
                                    </div>

                                    <div className="bg-white px-8 pt-8 pb-4 space-y-4 text-left">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                                                Item
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {selectedDetail?.Product?.productName ||
                                                    selectedDetail?.product?.productName ||
                                                    "Selected item"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Quantity in order: {selectedDetail?.quantity ?? 0}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-left">
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                    Quantity to return
                                                </label>
                                                {isOfferBundle ? (
                                                    <div className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-800">
                                                        {itemMaxQuantity} (full offer bundle)
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={itemMaxQuantity}
                                                        value={itemRefundQuantity}
                                                        onChange={(e) =>
                                                            setItemRefundQuantity(
                                                                Number(e.target.value) || 1
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
                                                    />
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                    Refund method
                                                </label>
                                                <div className="space-y-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setItemRefundMethod("POINTS")}
                                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${itemRefundMethod === "POINTS"
                                                            ? "border-[#005000] bg-green-50 text-[#005000]"
                                                            : "border-gray-200 text-gray-700"
                                                            }`}
                                                    >
                                                        <Wallet className="w-4 h-4" />
                                                        <span className="font-semibold">
                                                            JS Mart Points
                                                        </span>
                                                    </button>
                                                    {!((order?.paymentType?.type || "")
                                                        .toLowerCase()
                                                        .includes("cash on delivery") ||
                                                        (order?.paymentType?.type || "")
                                                            .toLowerCase()
                                                            .includes("cod")) && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setItemRefundMethod("BANK")}
                                                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${itemRefundMethod === "BANK"
                                                                    ? "border-[#005000] bg-green-50 text-[#005000]"
                                                                    : "border-gray-200 text-gray-700"
                                                                    }`}
                                                            >
                                                                <Banknote className="w-4 h-4" />
                                                                <span className="font-semibold">
                                                                    Original payment method
                                                                </span>
                                                            </button>
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-left">
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Reason for return
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={itemRefundReason}
                                                onChange={(e) => setItemRefundReason(e.target.value)}
                                                placeholder="Briefly describe the issue or reason for your return..."
                                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 resize-none"
                                            />
                                            {isOfferBundle && (
                                                <p className="mt-2 text-[11px] text-gray-500">
                                                    This item is part of an offer. Returning it means returning the entire bundle ({itemMaxQuantity} units, including free items).
                                                </p>
                                            )}
                                        </div>

                                        <div className="text-left">
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Evidence Image (Required)
                                            </label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-emerald-400 transition-colors">
                                                <div className="space-y-1 text-center">
                                                    {itemRefundEvidence ? (
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-24 h-24 rounded-lg overflow-hidden mb-2 border border-gray-200">
                                                                <img
                                                                    src={URL.createObjectURL(itemRefundEvidence)}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-600 truncate max-w-[200px]">{itemRefundEvidence.name}</p>
                                                            <button
                                                                onClick={() => setItemRefundEvidence(null)}
                                                                className="text-xs text-red-500 font-bold mt-2 hover:underline"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="flex text-sm text-gray-600">
                                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                                                                    <span>Upload a file</span>
                                                                    <input
                                                                        type="file"
                                                                        className="sr-only"
                                                                        accept="image/*"
                                                                        onChange={(e) => {
                                                                            if (e.target.files && e.target.files[0]) {
                                                                                setItemRefundEvidence(e.target.files[0]);
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                                <p className="pl-1">or drag and drop</p>
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                PNG, JPG up to 10MB
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 px-8 py-6 flex flex-col gap-3">
                                        <Button
                                            onClick={submitItemRefund}
                                            disabled={submittingItemRefund}
                                            className="w-full bg-[#005000] hover:bg-[#003d00] h-12 font-bold rounded-xl shadow-lg shadow-green-900/10 active:scale-[0.98] transition-all"
                                        >
                                            {submittingItemRefund ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                    Submitting request...
                                                </>
                                            ) : (
                                                "Submit Return Request"
                                            )}
                                        </Button>
                                        <button
                                            onClick={closeItemRefundModal}
                                            disabled={submittingItemRefund}
                                            className="w-full py-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            Nevermind, go back
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Review Modal */}
            <Transition.Root show={reviewModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[9999]" onClose={closeReviewModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 scale-95"
                                enterTo="opacity-100 translate-y-0 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 scale-100"
                                leaveTo="opacity-0 translate-y-4 scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-[2rem] bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-[#00028C] px-6 py-8 text-center text-white relative">
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                            <Star className="h-8 w-8 text-white fill-white" />
                                        </div>
                                        <Dialog.Title as="h3" className="text-2xl font-bold">
                                            Review Product
                                        </Dialog.Title>
                                        <p className="mt-2 text-indigo-100 text-sm">
                                            Share your thoughts about {selectedDetail?.Product?.productName || selectedDetail?.product?.productName}
                                        </p>
                                    </div>

                                    <div className="bg-white px-8 pt-8 pb-4 space-y-6 text-left">
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm font-semibold text-gray-700 mb-3">Rate your product</p>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setReviewRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className="transition-all transform hover:scale-110 focus:outline-none"
                                                    >
                                                        <Star
                                                            className={cn(
                                                                "w-10 h-10 transition-colors duration-200",
                                                                (hoverRating ? star <= hoverRating : star <= reviewRating)
                                                                    ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                                                                    : "text-gray-200 fill-gray-100 hover:text-amber-200"
                                                            )}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-xs font-bold mt-3 uppercase tracking-widest text-[#00028C]">
                                                {reviewRating === 5 ? "Excellent!" :
                                                    reviewRating === 4 ? "Very Good" :
                                                        reviewRating === 3 ? "Average" :
                                                            reviewRating === 2 ? "Poor" :
                                                                reviewRating === 1 ? "Terrible" : ""}
                                            </p>
                                        </div>

                                        <div className="text-left">
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                Your Review (Optional)
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                placeholder="What did you like or dislike? How was the quality?"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 px-8 py-6 flex flex-col gap-3 border-t border-gray-100">
                                        <Button
                                            onClick={submitReview}
                                            disabled={submittingReview}
                                            className="w-full bg-[#00028C] hover:bg-[#00026e] h-12 font-bold rounded-xl shadow-lg shadow-indigo-900/10 active:scale-[0.98] transition-all"
                                        >
                                            {submittingReview ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                    Submitting Review...
                                                </>
                                            ) : (
                                                "Submit Review"
                                            )}
                                        </Button>
                                        <button
                                            onClick={closeReviewModal}
                                            disabled={submittingReview}
                                            className="w-full py-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
}
