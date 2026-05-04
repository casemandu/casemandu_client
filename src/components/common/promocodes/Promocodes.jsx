'use client'
import Countdown, { zeroPad } from 'react-countdown'
import { GoPlus } from 'react-icons/go'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const Promocodes = ({ setIsPromocodes, promocodes = [] }) => {

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Offer has expired</span>
    } else {
      return (
        <span>
          {zeroPad(days)} days {zeroPad(hours)}:{zeroPad(minutes)}:
          {zeroPad(seconds)}
        </span>
      )
    }
  }
  return promocodes && promocodes.length > 0 ? (
    <div>
      <Swiper
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true}
        modules={[Autoplay]}
      >
        {promocodes?.map((promocode) => (
          <SwiperSlide key={promocode?._id}>
            <div className='text-center font-medium cursor-grab p-2 bg-primary shadow text-primary-foreground'>
              <h1>{promocode?.title}</h1>
              <Countdown
                date={new Date(promocode?.expiresAt).getTime()}
                renderer={renderer}
                zeroPadDays={2}
              />
              <button
                type='button'
                onClick={() => setIsPromocodes(false)}
                className='absolute top-4 right-3 text-primary-foreground border border-white hover:bg-white/10 p-1.5 inline-flex items-center justify-center h-8 w-8'
              >
                <GoPlus className='rotate-45 h-6 w-6' />
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  ) : null
}

export default Promocodes
