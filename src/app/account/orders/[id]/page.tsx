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
    Loader2
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import orderService from "@/services/order.service";
import toast from "react-hot-toast";
import { useModal } from "@/components/providers/ModalProvider";

export default function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const id = params.id;
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [submittingCancel, setSubmittingCancel] = useState(false);
    const [refundMethod, setRefundMethod] = useState<"BANK" | "POINTS" | null>(null);

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
        if (id) {
            fetchOrder();
        }
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

    if (loading) {
        return (
            <div className="min-h-screen pt-[120px] flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005000]"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen pt-[120px] flex flex-col justify-center items-center bg-gray-50 gap-4">
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
                { status: 'Order Placed', completed: true, date: new Date(order.createdAt).toLocaleDateString() },
                { status: 'Cancelled', completed: true, date: new Date(order.updatedAt).toLocaleDateString(), isCancelled: true }
            ];
        }

        const statusOrder = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        const currentIndex = statusOrder.indexOf(orderStatus);

        return statusOrder.map((status, index) => ({
            status: status.charAt(0) + status.slice(1).toLowerCase(), // Capitalize
            completed: index <= currentIndex,
            date: index === currentIndex ? new Date(order.updatedAt).toLocaleDateString() : '',
            isCancelled: false
        }));
    };

    const trackingSteps = getSteps(order.status || 'PENDING');

    return (
        <div className="min-h-screen bg-gray-50 pt-[120px] pb-12">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
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
                                {order.status === 'CANCELLED' && (
                                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold border border-red-200">
                                        CANCELLED
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
                            {order.status !== 'CANCELLED' && (
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
                                        <div className={`hidden md:block absolute top-[20px] left-[50%] right-[-50%] h-1 ${step.completed && trackingSteps[index + 1].completed ? 'bg-[#005000]' : 'bg-gray-200'} z-0`} />
                                    )}

                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${step.completed ? 'bg-[#005000] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        {step.completed ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                    </div>
                                    <p className={`mt-2 font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.status}</p>
                                    {step.date && <p className="text-xs text-gray-500 mt-1">{step.date}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Order Items</h3>

                    <div className="space-y-4">
                        {order.details?.map((detail: any) => {
                            const product = detail.Product || detail.product;
                            const primaryImage = product?.images?.find((img: any) => img.isPrimary) || product?.images?.[0];
                            const imgRaw = primaryImage?.productImg || product?.productImage || product?.image;
                            const imgSrc = imgRaw
                                ? (imgRaw.startsWith("http") ? imgRaw : (imgRaw.startsWith("/") ? imgRaw : `/${imgRaw}`))
                                : "/placeholder.png";

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

            {/* Refund Selection Modal */}
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
        </div>
    );
}
