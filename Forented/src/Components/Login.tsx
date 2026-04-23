import { useState, useContext } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { loginUser } from "../Servers/ProducteServer";
import { checkUser } from "../utlis/checkuser";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../Context/ShopContext";

const Login = () => {
  const navigate = useNavigate();
  const context = useContext(ShopContext);
  const setUser = context?.setUser;
  const setIsGuest = context?.setIsGuest;
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await loginUser(form.email, form.password);
         console.log(response.data);
         
      if (response.data.success) {
        const userData = await checkUser();
        setUser?.(userData);
        toast.success("Login successful! Welcome back to Sci-Fai Store.");
        navigate("/");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-orange-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/40">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-between gap-8 bg-gradient-to-br from-orange-500 via-pink-500 to-violet-600 p-10 text-white">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-4 py-1 text-xs uppercase tracking-[0.25em] text-white/90">
                New here?
              </span>
              <h2 className="mt-8 text-4xl font-extrabold leading-tight">
                Login to your account and shop smarter.
              </h2>
              <p className="mt-4 max-w-md text-sm text-orange-100/90">
                Join the Sci-Fai Store family to save favorites, track orders,
                and access exclusive offers on your favorite products.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-lg shadow-black/10 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-100">
                  Fast checkout
                </p>
                <p className="mt-3 text-base text-white/90">
                  Save your details and buy in just a few clicks.
                </p>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-lg shadow-black/10 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-100">
                  Personalized picks
                </p>
                <p className="mt-3 text-base text-white/90">
                  Get product suggestions tailored for your style.
                </p>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-lg shadow-black/10 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-100">
                  Exclusive deals
                </p>
                <p className="mt-3 text-base text-white/90">
                  Unlock special offers and early access to new drops.
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-10 sm:px-12 sm:py-14">
            <div className="mb-8">
              <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                Login
              </span>
              <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                Login to your account
              </h1>
              <p className="mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
                Fill in your details to start shopping the latest products, save
                favorites, and enjoy fast checkout.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-700">
                Email address
                <input
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Password
                <div className="relative">
                  <input
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM11 7a1 1 0 100-2H9.414l1.293-1.293a1 1 0 10-1.414-1.414L7 3.586V2a1 1 0 10-2 0v2.586L2.293 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-2.464-2.464A9.961 9.961 0 0019.999 10c-1.274-4.057-5.064-7-9.999-7-1.347 0-2.651.195-3.886.56L8.586 5H10a1 1 0 100-2h-1.414l1.293-1.293zM6.586 10a4 4 0 004.828 3.586 1 1 0 00-1.414-1.414A2 2 0 008 10a1 1 0 10-1.414 1.414 4 4 0 00-.586-2a1 1 0 001.414-1.414A4 4 0 006.586 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </label>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-orange-500/20 transition duration-200 hover:scale-[1.01] hover:shadow-orange-500/30"
              >
                Login to your account
              </button>
              <button
                type="button"
                onClick={() => {
                  setUser?.(null);
                  setIsGuest?.(true);
                  navigate("/");
                }}
                className="mt-4 w-full rounded-full border border-orange-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-orange-700 shadow-sm transition duration-200 hover:bg-orange-50"
              >
                Continue as Guest
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              you don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-orange-600 hover:text-orange-700"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
