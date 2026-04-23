import { useState,useEffect } from "react"
import banner1 from "../assets/Image/banner1.png"
import banner2 from "../assets/Image/banner2.png"
import banner3 from "../assets/Image/banner3.png"
import banner4 from "../assets/Image/banner4.png"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

const UpperOffer = () => {

  const [current,setcurrent] = useState(0)

  const images = [banner1,banner2,banner3,banner4]

  useEffect(() =>{
     const timer = setInterval(() => {
       setcurrent((prev) => (prev + 1) % images.length)
     },4000)
     return () => clearInterval(timer)
  },[images.length])

  const nextSlide = () => {
    setcurrent((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setcurrent((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group">

      {/* Images */}
      <div className="flex h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img
              src={image}
              className="w-full h-full object-cover"
              alt={`Banner ${index + 1}`}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
      >
        <FaChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setcurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-orange-500 scale-125'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

    </div>
  )
}

export default UpperOffer