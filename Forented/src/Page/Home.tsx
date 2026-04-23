import BestSeller from "../Components/BestSeller";
import Footer from "../Components/Footer";
import LetestCollection from "../Components/LetestCollection";
import UpperOffer from "../Components/UpperOffer";
import bestOffer from "../assets/Image/best-offer.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <UpperOffer />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Summer Sale Section */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 rounded-3xl shadow-2xl shadow-orange-200/40 overflow-hidden">
          <div className="grid lg:grid-cols-2 items-center">
            <div className="p-8 lg:p-12 space-y-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-100">
                Limited time offer
              </p>
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-white">
                SUMMER SALE
              </h1>
              <p className="text-lg lg:text-xl text-orange-50">
                UP TO <span className="font-black text-2xl lg:text-3xl">50% OFF</span> on selected
                bestsellers.
              </p>
              <button className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Shop Now →
              </button>
            </div>
            <div className="relative p-8 lg:p-12">
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <img
                  src={bestOffer}
                  alt="Summer Sale Offer"
                  className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full border border-white/30 bg-white/20 shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Collection */}
        <section className="py-8">
          <LetestCollection />
        </section>

        {/* Best Sellers */}
        <section className="py-8">
          <BestSeller />
        </section>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
