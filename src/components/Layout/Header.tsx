import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">

        <Link to="/" className="text-2xl font-bold flex items-center">
          <span>🛍️</span> 
          <span className="hidden lg:inline ml-2">MyShop</span> {/* Show text only on lg */}
        </Link>

      
        <nav className="">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-gray-200 transition">Home</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-gray-200 transition">Products</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-gray-200 transition">Cart 🛒</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
