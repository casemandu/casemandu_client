import moment from 'moment'
import Link from 'next/link'

const OrderDetailsSection = ({ order }) => {
  return (
    <>
      <h1 className='text-left my-5 text-3xl font-medium'>
        ORDER #{order?.order_id}
      </h1>
      <div className='grid lg:grid-cols-3 gap-5 w-full'>
        <div className='lg:col-span-2'>
          <h2 className='text-2xl font-medium border-t'>Shipping Details</h2>
          <p className='text-medium text-black mt-4'>
            Ordered Date:{' '}
            <span className='text-gray-500'>
              {moment(order?.createdAt).format('LL')}
            </span>
          </p>
          <p className='text-medium text-black mt-4'>
            Receiver's Name:{' '}
            <span className='text-gray-500'>{order?.name}</span>
          </p>
          <p className='text-medium text-black mt-4'>
            Receiver's Phone Number:{' '}
            <span className='text-gray-500'>{order?.phone}</span>
          </p>
          <p className='text-medium text-black mt-4'>
            Receiver's Address:{' '}
            <span className='text-gray-500'>{`${order?.shippingAddress}, ${order?.city}`}</span>
          </p>

          {order?.status === 'Pending' ? (
            <div className='mt-3 bg-blue-200/50 w-full px-3 py-4 text-blue-600'>
              {order?.status}
            </div>
          ) : (
            <div className='mt-3 bg-green-200/50 w-full px-3 py-4 text-green-600'>
              {order?.status}
            </div>
          )}
          <h2 className='text-2xl font-medium mt-5 border-t'>Payment</h2>

          <p className='text-medium text-black mt-4'>
            Payment Method:{' '}
            <span className='text-gray-500'>{order?.paymentMethod}</span>
          </p>
          <a href={order?.paymentImage} target='_blank'>
            <img
              src={order?.paymentImage}
              alt='payment'
              width={200}
              height={200}
              className='w-20 h-20 object-cover mt-2'
            />
          </a>

          <h2 className='text-2xl font-medium mt-5 border-t'>Order Items</h2>
          <div className='grid grid-cols-1 gap-4 mt-4'>
            {order?.orderItems?.map((item) => {
              // Use customImage for custom orders, fallback to image, then product image
              const itemImage = item?.customImage || item?.image || item?.product?.images?.[0] || '/images/placeholder.png';
              return (
                <div
                  key={item?._id}
                  className='flex items-center justify-between border-b border-gray-200 pb-4'
                >
                  <div className='flex items-center gap-4'>
                    <a href={itemImage} target='_blank' rel='noopener noreferrer'>
                      <img
                        src={itemImage}
                        alt={item?.name}
                        className='w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity'
                      />
                    </a>
                    <div>
                      <h3 className='text-lg font-medium'>{item?.name}</h3>
                      <p className='text-medium text-gray-500'>{item?.variant}</p>
                      {item?.isCustom && (
                        <p className='text-xs text-purple-600 font-medium'>Custom Design</p>
                      )}
                      <p className='text-medium text-gray-500'>
                        Rs {Number(item?.price).toLocaleString('en')} x{' '}
                        {item?.qty}
                      </p>
                    </div>
                  </div>
                  <p className='text-medium text-black'>
                    Rs {Number(item?.price * item?.qty).toLocaleString('en')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className='border border-gray-300 h-auto py-4'>
            <h1 className='text-2xl font-medium mx-2'>Order Summary</h1>
            <div className='mt-5'>
              <div className='grid grid-cols-2 border-y border-gray-300 py-2 px-2'>
                <p className='text-medium text-black'>Subtotal:</p>
                <p className='text-medium text-black'>
                  Rs {Number(order?.priceSummary?.total).toLocaleString('en')}
                </p>
              </div>
              {order?.priceSummary?.discountAmount ? (
                <div className='grid grid-cols-2 border-b border-gray-300 py-2 px-2'>
                  <p className='text-medium text-black'>Coupon Discount :</p>
                  <p className='text-medium text-black'>
                    Rs{' '}
                    {Number(order?.priceSummary?.discountAmount).toLocaleString(
                      'en'
                    )}
                  </p>
                </div>
              ) : null}
              <div className='grid grid-cols-2 border-b border-gray-300 py-2 px-2'>
                <p className='text-medium text-black'>Shipping:</p>
                <p className='text-medium text-black'>
                  Rs{' '}
                  {Number(order?.priceSummary?.deliveryCharge).toLocaleString(
                    'en'
                  )}
                </p>
              </div>
              <div className='grid grid-cols-2 border-b border-gray-300 py-2 px-2'>
                <p className='text-medium text-black'>Grand Total:</p>
                <p className='text-medium text-black'>
                  Rs{' '}
                  {Number(order?.priceSummary?.grandTotal).toLocaleString('en')}
                </p>
              </div>
              <div className='px-3'>
                <Link
                  className='mt-5 w-full inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center font-medium text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
                  href={`/order/track?orderId=${order?.order_id}&phone=${order?.phone}`}
                >
                  Track Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetailsSection
