import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../Servers/ProducteServer";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);
      toast.success("Password reset email sent. Check your inbox.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Unable to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-orange-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/40">
        <div className="px-8 py-10 sm:px-12 sm:py-14">
          <div className="mb-8">
            <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Reset password
            </span>
            <h1 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
              Forgot your password?
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
              Enter the email associated with your account and we’ll send you a link to reset your password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              Email address
              <input
                name="email"
                required
                value={email}
                onChange={handleChange}
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-orange-500/20 transition duration-200 hover:scale-[1.01] hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending reset email..." : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
