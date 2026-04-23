import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../Servers/ProducteServer";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "password") {
      setPassword(value);
    } else {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      toast.error("Reset token is missing. Please request a new password reset link.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please check both fields.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      toast.success("Password reset successful. You can now login with your new password.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Unable to reset password. Please try again or request a new link.");
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
              Choose a new password
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
              Enter a strong new password and confirm it to complete your account recovery.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              New password
              <input
                name="password"
                required
                value={password}
                onChange={handleChange}
                type="password"
                placeholder="At least 8 characters"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Confirm password
              <input
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="Repeat your new password"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-orange-500/20 transition duration-200 hover:scale-[1.01] hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting password..." : "Reset password"}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 text-center text-sm text-slate-500 sm:flex-row sm:justify-between">
            <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700">
              Back to login
            </Link>
            <Link to="/forgot-password" className="font-semibold text-orange-600 hover:text-orange-700">
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;