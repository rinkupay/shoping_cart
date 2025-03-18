import React, { useEffect, useState } from "react";
import { LiaCartPlusSolid } from "react-icons/lia";
import toast from "react-hot-toast";
import { AiOutlineMinus } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface CartItem extends Product {
  quantity: number;
}

const ProductCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = () => {
      try {
        const saved = localStorage.getItem("cart");
        if (!saved) return;

        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(isCartItem)) {
          setCartItems(parsed);
        }
      } catch (e) {
        console.error("Cart load error:", e);
      }
    };

    loadCart();
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      try {
        localStorage.setItem("cart", JSON.stringify(cartItems));
      } catch (e) {
        console.error("Cart save error:", e);
      }
    }
  }, [cartItems]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const increaseQuantity = async (id: number) => {
    let itemTitle = "";
    await setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          itemTitle = item.title;
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );

    if (itemTitle) {
      toast.success(`Increased quantity of "${itemTitle}"!`);
    }
  };

  const decreaseQuantity = async (id: number) => {
    let itemTitle = "";
    await setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id && item.quantity > 1) {
            itemTitle = item.title;
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );

    if (itemTitle) {
      toast.success(`Decreased quantity of "${itemTitle}"!`);
    }
  };

  // REMOVED ITEM

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);

    if (updatedCart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      localStorage.removeItem("cart");
    }

    toast.success(`Item removed from cart!`);
  };

  // COMPLETE ORDER

  const completeOrder = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    toast.success("Order completed successfully!");
  };

  function isCartItem(item: any): item is CartItem {
    return (
      typeof item === "object" &&
      "id" in item &&
      "title" in item &&
      "price" in item &&
      "quantity" in item
    );
  }

  return (
    <div className="w-full container mx-auto p-6 flex flex-col md:flex-row gap-6">
      <div className="md:w-2/3 w-full">
        {cartItems.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center min-h-[300px] text-center h-full">
            <p className="text-gray-500 text-lg font-medium w-full">
              Your cart is empty.
            </p>
            <LiaCartPlusSolid size={100} />
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {item.title.slice(0, 20)}
                  </h3>
                  <p className="text-gray-600">
                    Price: ₹{item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-8 h-8 flex items-center justify-center bg-blue-200 cursor-pointer rounded-full"
                    >
                      <AiOutlineMinus />
                    </button>
                    <span className="text-lg font-medium  bg-amber-50 border pl-3 pr-3">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="w-8 h-8 flex items-center justify-center bg-blue-200 cursor-pointer rounded-full"
                    >
                      <AiOutlinePlus />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="md:w-1/3 w-full p-4 bg-white shadow-lg rounded-lg border h-fit">
          <h3 className="text-xl font-bold mb-4">Price Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee:</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-blue-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={completeOrder}
            className="mt-4 w-full cursor-pointer bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Complete Order
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCart;
