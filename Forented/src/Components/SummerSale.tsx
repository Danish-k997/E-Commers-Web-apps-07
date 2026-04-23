

const SummerSaleBanner = () => {
  return (
    <div className="relative w-full h-64  max-w-5xl mx-auto my-10 overflow-hidden rounded-xl border border-white/20 bg-slate-900/30 shadow-2xl shadow-orange-900/30">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-[length:200%_200%] animate-[gradient-shift_4s_ease_infinite] blur-sm opacity-70"></div>
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-5 px-4 py-14 text-center md:py-16">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-widest text-white uppercase drop-shadow-lg animate-text-orbit">
          Summer Sale
        </h2>

        <div className="flex items-center gap-3">
          <span className="h-[1px] w-16 bg-white/80" />
          <p className="text-base md:text-xl font-semibold text-white/90 uppercase tracking-wide animate-slide-right">
            Up To <span className="text-white font-black text-2xl md:text-3xl">50%</span> Off
          </p>
          <span className="h-[1px] w-16 bg-white/80" />
        </div>

        <button className="relative  overflow-hidden rounded-full border border-white/25 bg-gradient-to-r from-sky-600 via-indigo-600 to-cyan-600 px-8 py-3 text-sm md:text-base font-bold text-white shadow-lg shadow-cyan-900/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-900/40 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 animate-button-fly">
          <span className="relative z-10">Shop Now</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-70">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default SummerSaleBanner;