"use client";
import { createContext, useContext, useEffect, useState } from "react";
const CartContext = createContext([]);
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(
        (item) =>
          item.sub_activity_id === product.sub_activity_id &&
          item.activity_id === product.activity_id
      );

      if (exists) {
        // ถ้ามีอยู่แล้ว → ไม่ต้องทำอะไร
        return prev;
      }

      // ถ้ายังไม่มี → เพิ่มเข้า
      return [
        ...prev,
        {
          ...product,
          activity_id: product.activity_id,
          sub_activity_id: product.sub_activity_id,
        },
      ];
    });
  };

  const removeFromCart = (sub_activity_id, activity_id) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          item.sub_activity_id !== sub_activity_id ||
          item.activity_id !== activity_id
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
