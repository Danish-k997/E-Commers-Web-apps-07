import { Link } from "react-router-dom"
import type { ProductType } from "../Types/ProductsType.ts";

const ProductsCart = ({_id, images, name, price }:ProductType) => {
  return (
    <Link className="group" to={`/products/${_id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1">

        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50">
          <img
            className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            src={images[0]}
            alt={name}
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

          {/* Quick view button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full font-medium text-sm hover:bg-white transition-colors duration-200">
              Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
            {name}
          </h3>
          <p className="text-lg sm:text-xl font-bold text-orange-600">
            ${price.toFixed(2)}
          </p>
        </div>

      </div>
    </Link>
  )
}

export default ProductsCart  
