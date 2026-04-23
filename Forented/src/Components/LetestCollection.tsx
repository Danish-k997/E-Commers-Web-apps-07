
import Title from './Title'
import { useEffect, useState } from 'react'
import ProductsCart from './ProductsCart'
import { getProducts } from '../Servers/ProducteServer'
import type { ProductType } from '../Types/ProductsType'

const LetestCollection = () => {
  const [products, setProducts] = useState<ProductType[]>([])

 useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  fetchProducts();
}, []);

  const latestCollection = products.slice(0, 10)

  return (
    <div className="py-8">
      <Title
        title="Latest Collection"
        subtitle="Discover our newest arrivals"
        accentColor="#F97316"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
         {latestCollection.map((product,i) => (
          <ProductsCart key={i} {...product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
          View All Products →
        </button>
      </div>
    </div>
  )
}

export default LetestCollection