import {Link,NavLink} from "react-router-dom"
import insta from '../assets/Image/insta.png'
import linkdin from '../assets/Image/image.png'
import github from '../assets/Image/github.png'
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-10 sm:px-8">
        <div className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-lg md:flex md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Sign up for Newsletter</h2>
            <p className="text-sm text-blue-100">Get the latest updates and exclusive offers.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white placeholder:text-blue-100 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-400/40 md:w-[280px]"
            />
            <button className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-orange-400">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-xl font-bold">About Us</h3>
            <p className="text-sm text-blue-100">Our Story</p>
            <p className="text-sm text-blue-100">Careers</p>
            <NavLink to={'/contacts'} className="text-sm text-blue-100">Contact Us</NavLink>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-bold">Customer Service</h3>
            <NavLink to={'/myaccounts'} className="text-sm text-blue-100">My Account</NavLink>
            <p className="text-sm text-blue-100">Orders</p>
            <p className="text-sm text-blue-100">FAQs</p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-bold">Quick Links</h3>
            <p className="text-sm text-blue-100">Privacy Policy</p>
            <p className="text-sm text-blue-100">Terms & Conditions</p>
            <p className="text-sm text-blue-100">Shipping Info</p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-bold">Follow Us</h3>
            <div className="flex gap-3">
              <Link to="https://www.instagram.com/danish_khan_969" target="_blank" rel="noopener noreferrer">
                <img src={insta} alt="Instagram" className="h-8 w-8 rounded-lg bg-white p-1" />
              </Link>
              <Link to="https://www.linkedin.com/in/Danish Khan" target="_blank" rel="noopener noreferrer">
                <img src={linkdin} alt="LinkedIn" className="h-8 w-8 rounded-lg bg-white p-1" />
              </Link>
              <Link to="https://github.com/Danish-k997" target="_blank" rel="noopener noreferrer">
                <img src={github} alt="GitHub" className="h-8 w-8 rounded-lg bg-white p-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 text-center text-sm text-blue-200">
          © {new Date().getFullYear()} Forented. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer