"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Package,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle,
    Clock,
    ChevronLeft,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import orderService from "@/services/order.service";
import toast from "react-hot-toast";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getOrderById(params.id);
                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order:", error);
                toast.error("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchOrder();
        }
    }, [params.id]);

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
        const statusOrder = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        const currentIndex = statusOrder.indexOf(currentStatus.toUpperCase());

        return statusOrder.map((status, index) => ({
            status: status.charAt(0) + status.slice(1).toLowerCase(), // Capitalize
            completed: index <= currentIndex,
            date: index === currentIndex ? new Date(order.updatedAt).toLocaleDateString() : ''
        }));
    };

    const trackingSteps = getSteps(order.status || 'PENDING');

    return (
        <div className="min-h-screen bg-gray-50 pt-[120px] pb-12">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Order #{order.id}
                            </h2>
                            <p className="text-gray-600">
                                Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.details?.length || 0} items
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {/* <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Invoice
                            </Button> */}
                            <Button className="bg-[#00028C] hover:bg-[#00026e]">
                                <Truck className="h-4 w-4 mr-2" />
                                Track Order
                            </Button>
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
                        {order.details?.map((detail: any) => (
                            <div
                                key={detail.id}
                                className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#005000] transition-colors"
                            >
                                <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    {detail.Product?.productImage ? (
                                        <img src={detail.Product.productImage} alt={detail.Product.productName} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{detail.Product?.productName || 'Unknown Product'}</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Quantity: {detail.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">
                                        Rs. {(detail.pricePerUnit * detail.quantity).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600">Rs. {detail.pricePerUnit} each</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-3 max-w-md ml-auto">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>Rs. {order.subtotal?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Discount</span>
                                <span className="text-red-500">- Rs. {order.discount?.toFixed(2) || '0.00'}</span>
                            </div>
                            {/* <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>Rs. {order.tax?.toFixed(2) || '0.00'}</span>
                            </div> */}
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                                <span>Total</span>
                                <span className="text-[#005000]">Rs. {order.totalAmount?.toFixed(2)}</span>
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
        </div>
    );
}
