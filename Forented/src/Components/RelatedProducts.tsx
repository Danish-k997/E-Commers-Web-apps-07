

import React from 'react';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  category: string;
  images: string[];
  name: string;
  price: number;
}

interface RelatedProductsProps {
  products: Product[];
  category: string;
  currentId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, category, currentId }) => {
  const related = products.filter((item) =>
    item.category === category &&
    item._id !== currentId
  );

  if (related.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 py-8">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-3">
          You might also like
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Related Products
        </h2>
        <div className="mx-auto h-1.5 w-20 rounded-full bg-orange-500 shadow-sm"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
        {related.slice(0, 5).map((item) => (
          <Link
            key={item._id}
            to={`/products/${item._id}`}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1">

              {/* Image Container */}
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
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
                  {item.name}
                </h3>
                <p className="text-lg sm:text-xl font-bold text-orange-600">
                  ${item.price.toFixed(2)}
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* View All Related Button */}
      <div className="text-center mt-12">
        <Link
          to={`/categories?category=${category}`}
          className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          View All {category} Products →
        </Link>
      </div>
    </div>
  );
};

export default RelatedProducts;