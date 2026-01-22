"use client";
import { paymentMethods } from "@/data/paymentMethods";
import { clearCart } from "@/store/features/cart/cartSlice";
import { useAddOrderMutation } from "@/store/features/order/orderSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BsUpload } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";

const PaymentModel = ({ setShowModal, order }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [paymentImage, setPaymentImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [addOrder, { data, isLoading, isError, isSuccess, error }] =
    useAddOrderMutation();

  useEffect(() => {
    if (isSuccess && data) {
      document.body.style.overflow = "auto";
      toast.success("Order placed successfully.");
      if (data._id) {
        router.push(`/order/${data._id}`);
        dispatch(clearCart());
      }
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      const errorMessage = error?.data?.message || 
                          error?.message || 
                          "Failed to place order. Please try again.";
      toast.error(errorMessage);
      // Don't redirect on error - let user see the error and try again
      // router.push(`/`);
      // dispatch(clearCart());
    }
  }, [isError]);

  const handlePaymentConfirmation = async () => {
    if (!paymentImage) {
      return toast.error("Please upload the payment screenshot");
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      
      // Append all order fields individually as the backend expects
      if (order.name) formData.append("name", order.name);
      if (order.phone) formData.append("phone", order.phone);
      if (order.email) formData.append("email", order.email);
      if (order.city) formData.append("city", typeof order.city === 'string' ? order.city : order.city.value || order.city);
      if (order.shippingAddress) formData.append("shippingAddress", order.shippingAddress);
      if (order.paymentMethod) formData.append("paymentMethod", order.paymentMethod);
      if (order.additionalInfo) formData.append("additionalInfo", order.additionalInfo);
      if (order.district) formData.append("district", order.district);
      
      // Stringify nested objects/arrays
      if (order.orderItems && Array.isArray(order.orderItems) && order.orderItems.length > 0) {
        formData.append("orderItems", JSON.stringify(order.orderItems));
      }
      if (order.priceSummary && typeof order.priceSummary === 'object') {
        formData.append("priceSummary", JSON.stringify(order.priceSummary));
      }
      // Send customCaseCoordinates as empty object if not provided (backend expects it)
      if (order.customCaseCoordinates && typeof order.customCaseCoordinates === 'object' && Object.keys(order.customCaseCoordinates).length > 0) {
        formData.append("customCaseCoordinates", JSON.stringify(order.customCaseCoordinates));
      } else {
        formData.append("customCaseCoordinates", "{}");
      }
      
      // Append payment image file
      formData.append(
        "paymentImage",
        paymentImage,
        paymentImage.name || "payment-proof"
      );
      
      // Only append customImage if it exists and is a valid File/Blob
      // Backend should handle missing customImage field gracefully
      if (order.customImage && (order.customImage instanceof File || order.customImage instanceof Blob)) {
        formData.append("customImage", order.customImage, order.customImage.name || "custom-image");
      }

      const result = await addOrder(formData).unwrap();
      setIsUploading(false);
      
      
      // Close modal and redirect immediately if we have the result
      if (result && result.data._id) {
        document.body.style.overflow = "auto";
        setShowModal(false);
        toast.success("Order placed successfully.");
        router.push(`/order/${result.data._id}`);
        dispatch(clearCart());
      } else {
        // Fallback: let useEffect handle it
        console.warn("Order created but no _id in response:", result);
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Order creation error:", error);
      
      // Extract error message from various possible error structures
      let errorMessage = "Failed to place order. Please try again.";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(errorMessage);
      
      // Don't redirect on error, let user try again
      return;
    }
  };
  return (
    <>
      <div className="mx-0 sm:mx-3 md:mx-4 justify-center items-start sm:items-center flex overflow-x-hidden fixed inset-0 z-[9999] outline-none focus:outline-none p-0 sm:p-4">
        <div className="max-w-3xl w-full h-full sm:h-auto sm:my-auto sm:max-h-[calc(100vh-2rem)] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="relative bg-white rounded-lg shadow-xl m-2 sm:my-5 p-4 sm:p-6">
            <GoPlus
              onClick={() => setShowModal(false)}
              className="rotate-45 w-6 h-6 sm:w-8 sm:h-8 absolute right-3 top-3 sm:right-4 sm:top-4 cursor-pointer hover:text-black/75 hover:bg-black/10 rounded-full duration-300 z-[10000]"
            />

            <h1 className="text-xl sm:text-2xl font-medium pr-8 sm:pr-10">
              {order.paymentMethod === "Cash on Delivery"
                ? order?.paymentMethod
                : `Pay Now with ${order?.paymentMethod || "FonePay"}`}
            </h1>
            {order.paymentMethod === "Cash on Delivery" ? (
              <p className="text-xs sm:text-sm mt-2 sm:mt-3 text-gray-900">
                Please pay the mimimum amount of{" "}
                <span className="font-semibold">
                  Rs {Number(300).toLocaleString("en")}
                </span>{" "}
                to the following payment method and upload the payment
                screenshot below.
              </p>
            ) : (
              <p className="text-xs sm:text-sm mt-2 sm:mt-3 text-gray-900">
                Please pay the total amount of{" "}
                <span className="font-semibold">
                  Rs{" "}
                  {Number(order?.priceSummary?.grandTotal).toLocaleString("en")}
                </span>{" "}
                to the following payment method and upload the payment
                screenshot below.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start sm:items-center sm:justify-center mt-4 sm:mt-6">
              <div className="w-full flex flex-col items-center sm:items-start">
                <h2 className="text-sm sm:text-base text-gray-900 font-medium mb-3 sm:mb-0 sm:mt-5">Payment Method</h2>
                <div className="w-full flex justify-center sm:justify-start">
                  <img
                    className="h-48 w-48 xs:h-56 xs:w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80 mt-2 sm:mt-5 border border-black object-contain rounded-lg"
                    src={
                      paymentMethods?.find(
                        (method) => method.name === order.paymentMethod
                      )?.qrImage
                    }
                    alt={order.paymentMethod}
                    width={710}
                    height={710}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col items-center sm:items-start">
                <h2 className="text-sm sm:text-base text-gray-900 font-medium mb-3 sm:mb-0 sm:mt-5">
                  Upload your Payment Screenshot{" "}
                  <span className="ms-1 text-red-500">*</span>
                </h2>
                <div className="w-full flex justify-center sm:justify-start">
                  {!paymentImage ? (
                    <label
                      htmlFor="paymentImage"
                      className="h-48 w-48 xs:h-56 xs:w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80 mt-2 sm:mt-3 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                        <BsUpload className="w-5 h-5 sm:w-6 sm:h-6 mb-3 sm:mb-4 text-gray-500" />

                        <p className="mb-2 text-xs sm:text-sm text-gray-500 text-center">
                          Click to upload
                        </p>
                      </div>
                      <input
                        onChange={(e) => setPaymentImage(e.target.files[0])}
                        id="paymentImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="mt-2 sm:mt-3 flex h-auto w-fit relative border border-gray-300 rounded-lg">
                      <img
                        src={URL.createObjectURL(paymentImage)}
                        alt="custom"
                        className="object-cover rounded-lg h-48 w-48 xs:h-56 xs:w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80"
                        width={710}
                        height={710}
                      />

                      <RxCross2
                        onClick={() => setPaymentImage(null)}
                        className="rotate-90 sm:rotate-0 w-6 h-6 sm:w-8 sm:h-8 p-1 absolute right-2 top-2 sm:right-4 sm:top-4 cursor-pointer hover:text-black/75 bg-white/90 hover:bg-black/10 rounded-full duration-300 shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              className="mt-4 sm:mt-5 w-full text-sm sm:text-base py-2 sm:py-2.5"
              disabled={isUploading || isLoading}
              onClick={handlePaymentConfirmation}
            >
              {isUploading && !isLoading
                ? "Uploading..."
                : isLoading
                ? "Placing Order..."
                : "Confirm Payment"}
            </Button>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-[9998] bg-black"></div>
    </>
  );
};

export default PaymentModel;
