"use client";
import { districtOptions } from "@/data/districtOptions";
import { paymentMethods } from "@/data/paymentMethods";
// import axios from 'axios'
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiCart, BiMailSend, BiMap, BiPhone, BiUser } from "react-icons/bi";
import { CiDiscount1 } from "react-icons/ci";
import { TbLocation } from "react-icons/tb";
import { useSelector } from "react-redux";
import OrderSummary from "./OrderSummary";
// import Select from 'react-select'
// import OrderSummary from './OrderSummary'
// import PaymentModel from './PaymentModel'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaymentModel from "./PaymentModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const OrderDetails = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);

  const [checkingPromoCode, setCheckingPromoCode] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);

  const [orderDetails, setOrderDetails] = useState({
    name: "",
    phone: "",
    city: null,
    shippingAddress: "",
    additionalInfo: "",
    paymentMethod: "",
    paymentImage: "",
    email: "",
    orderItems: cartItems.map((item) => ({
      name: item.product.name,
      qty: item.quantity,
      image: item.product.image,
      price: item.price,
      variant: item.variant,
      product: item.product._id,
    })),
  });

  const [priceSummary, setPriceSummary] = useState({
    promoCode: "",
    subtotal: cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ),
    shipping: 150,
    discount: 0,
    disAmount: 0,
    total:
      cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) -
      (cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) *
        0) /
        100 +
      150,
    maxAmount: 0,
  });

  const handleChange = (e) => {
    setOrderDetails({
      ...orderDetails,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const shippingCharge =
      districtOptions?.find((option) => {
        if (`${option.district}` === orderDetails?.city?.value) {
          return option;
        }
      })?.price || 150;

    const subTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const disAmount = subTotal * (priceSummary?.discount / 100);

    setPriceSummary({
      ...priceSummary,
      disAmount:
        disAmount > priceSummary?.maxAmount
          ? priceSummary?.maxAmount
          : disAmount,
      shipping: shippingCharge,
      total:
        disAmount > priceSummary?.maxAmount
          ? subTotal - priceSummary?.maxAmount + shippingCharge
          : subTotal - disAmount + shippingCharge,
    });
  }, [orderDetails?.city]);

  const checkPromoCode = async (code) => {
    if (!code) {
      toast.dismiss();
      return toast.error("Please enter a promo code.");
    }
    try {
      setCheckingPromoCode(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/promocodes/${code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Invalid promo code.");
      }

      const data = await res.json();

      if (data) {
        const subTotal = cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        const disAmount = subTotal * (data.discount / 100);

        setPriceSummary({
          ...priceSummary,
          discount: data.discount,
          disAmount: disAmount > data.maxAmount ? data.maxAmount : disAmount,
          maxAmount: data.maxAmount,
          total:
            disAmount > data.maxAmount
              ? subTotal - data.maxAmount + priceSummary.shipping
              : subTotal - disAmount + priceSummary.shipping,
        });
        setCheckingPromoCode(false);
        return toast.success("Promo code applied successfully.");
      }
    } catch (error) {
      setCheckingPromoCode(false);
      toast.dismiss();
      return toast.error(
        error?.response?.data?.message || "Invalid promo code."
      );
    }
  };

  if (cartItems.length === 0)
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-2xl font-semibold">Your cart is empty.</p>
      </div>
    );

  return (
    <>
      <div className="grid lg:grid-cols-2 mt-8 gap-6">
        <div className="pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400 mt-2 text-sm">
            Check your items. And select a suitable payment method.
          </p>

          <OrderSummary cartItems={cartItems} />

          <p className="mt-8 text-lg font-medium">Payment Method</p>
          <div className="mt-5 flex gap-6 flex-wrap">
            {paymentMethods.map((method) => (
              <div className="relative" key={method.name}>
                <Input
                  id={method.name}
                  name="paymentMethod"
                  value={method.name}
                  onChange={handleChange}
                  className="peer hidden"
                  type="radio"
                />

                <label
                  className="peer-checked:border-2 peer-checked:border-primary peer-checked:bg-gray-50 flex items-center gap-2 cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                  htmlFor={method.name}
                >
                  <img
                    className="w-14 object-contain aspect-square"
                    src={method.image}
                    alt={method.name}
                    height={50}
                    width={50}
                  />
                  <span className="font-semibold">{method.name} </span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Shipping Details</p>
          <p className="text-gray-400 mt-2 text-sm">
            Complete your order by providing your shipping details.
          </p>
          <div>
            <label
              htmlFor="name"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="text"
                id="name"
                name="name"
                className="pl-11"
                placeholder="John Doe"
                value={orderDetails.name
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
                onChange={handleChange}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <BiUser className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <label
              htmlFor="phone"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="tel"
                id="phone"
                name="phone"
                className="pl-11"
                placeholder="98XXXXXXXX"
                value={orderDetails.phone}
                onChange={handleChange}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <BiPhone className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <label
              htmlFor="email"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="email"
                id="email"
                name="email"
                className="pl-11"
                placeholder="example@gmail.com"
                value={orderDetails.email}
                onChange={handleChange}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <BiMailSend className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <label
              htmlFor="card-no"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              District / City
              <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <div className="relative w-full flex-shrink-0">
                <Select
                  onValueChange={(newValue) =>
                    setOrderDetails({
                      ...orderDetails,
                      city: newValue,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a district..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {districtOptions?.map((option) => (
                        <SelectItem
                          key={option.district}
                          value={option.district}
                        >
                          {option.district}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <label
              htmlFor="shippingAddress"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="text"
                id="shippingAddress"
                name="shippingAddress"
                className="pl-11"
                placeholder="Kanakai 04, Surunga"
                value={orderDetails.shippingAddress}
                onChange={handleChange}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <TbLocation className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <label
              htmlFor="additionalInfo"
              className="mt-4 mb-2 block text-sm font-medium "
            >
              Additional Information
            </label>
            <div className="mt-3">
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                placeholder="Add a note for the delivery."
                value={orderDetails.additionalInfo}
                onChange={handleChange}
              />
            </div>
            <p className="my-2 text-sm">
              Delivery time: 2-3 days inside the valley, 4-5 days outside.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                checkPromoCode(priceSummary.promoCode);
              }}
            >
              <label
                htmlFor="promoCode"
                className="mt-4 mb-2 block text-sm font-medium "
              >
                Promo Code
              </label>
              <div className="relative">
                <Input
                  type="text"
                  id="promoCode"
                  name="promoCode"
                  className="pl-11"
                  disabled={priceSummary.discount > 0}
                  value={priceSummary.promoCode}
                  onChange={(e) => {
                    setPriceSummary({
                      ...priceSummary,
                      promoCode: e.target.value.toUpperCase(),
                    });
                  }}
                  placeholder="CASE50"
                />
                <Button
                  type="submit"
                  disabled={priceSummary.discount > 0}
                  className="absolute inset-y-0 right-0 "
                >
                  {checkingPromoCode ? "Checking..." : "Apply Promo"}
                </Button>

                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <CiDiscount1 className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </form>

            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                <p className="font-semibold text-gray-900">
                  Rs {Number(priceSummary?.subtotal).toLocaleString("en")}
                </p>
              </div>
              {priceSummary?.disAmount > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Discount ({priceSummary?.discount} % upto Rs{" "}
                    {Number(priceSummary?.maxAmount).toLocaleString("en")})
                  </p>
                  <p className="font-semibold text-gray-900">
                    Rs {Number(priceSummary?.disAmount).toLocaleString("en")}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Shipping</p>
                <p className="font-semibold text-gray-900">
                  Rs {Number(priceSummary?.shipping).toLocaleString("en")}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                Rs{" "}
                {Number(
                  priceSummary?.total % 1 !== 0
                    ? priceSummary?.total.toFixed(2)
                    : priceSummary?.total
                ).toLocaleString("en")}
              </p>
            </div>

            {orderDetails?.paymentMethod === "Cash on Delivery" && (
              <div className="mt-2">
                <p className="mt-1 text-right text-sm">
                  <span className="text-red-500">*</span> Initial payment of Rs{" "}
                  {Number(300).toLocaleString("en")} must be done for Cash on
                  Delivery orders.
                </p>
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              if (cartItems.length === 0) {
                toast.dismiss();
                return toast.error(
                  "Your cart is empty. Please add items to cart."
                );
              }

              if (!orderDetails.paymentMethod) {
                toast.dismiss();
                return toast.error("Please select a payment method.");
              }

              if (
                !orderDetails.name ||
                !orderDetails.phone ||
                !orderDetails.city ||
                !orderDetails.shippingAddress || !orderDetails.email
              ) {
                toast.dismiss();
                return toast.error("Please fill all the required fields.");
              }
              setShowModal(true);
            }}
            className="w-full mt-4"
          >
            <BiCart className="mr-3 h-5 w-5" />
            Place Order
          </Button>
        </div>
      </div>
      {showModal ? (
        <PaymentModel
          setShowModal={setShowModal}
          order={{
            ...orderDetails,
            priceSummary: {
              promoCode:
                priceSummary?.discount > 0 ? priceSummary.promoCode : null,
              total: priceSummary.subtotal,
              couponDiscount: priceSummary.discount,
              deliveryCharge: priceSummary.shipping,
              grandTotal: priceSummary.total,
            },
            district: orderDetails?.district?.value,
          }}
        />
      ) : null}
    </>
  );
};

export default OrderDetails;
