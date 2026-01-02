import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'

const Whatsapp = () => {
  return (
    <div>
      <a
        href="https://wa.me/+9779866335484"
        className="whatsapp_float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp className=' whatsapp-icon'/>
      </a>
    </div>
  )
}

export default Whatsapp
