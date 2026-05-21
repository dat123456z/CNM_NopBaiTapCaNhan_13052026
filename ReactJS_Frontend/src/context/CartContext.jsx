import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getToken = () => localStorage.getItem("accessToken");

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    const fetchCart = useCallback(async () => {
        const token = getToken();
        if (!token) { setItems([]); setTotal(0); return; }
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/carts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) { setItems([]); setTotal(0); return; }
            const data = await res.json();
            setItems(data.items || []);
            setTotal(data.total || 0);
        } catch {
            setItems([]); setTotal(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = getToken();
        if (token) fetchCart();

        const onStorage = (e) => {
            if (e.key === "accessToken") {
                if (e.newValue) fetchCart();
                else { setItems([]); setTotal(0); }
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1, color = null) => {
        const token = getToken();
        if (!token) throw new Error("Vui lòng đăng nhập.");
        const res = await fetch(`${API_URL}/api/carts`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity, color })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Lỗi thêm vào giỏ.");
        await fetchCart();
        return data;
    };

    const updateItem = async (cartItemId, quantity) => {
        const token = getToken();
        const res = await fetch(`${API_URL}/api/carts/${cartItemId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ quantity })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Lỗi cập nhật giỏ.");
        await fetchCart();
        return data;
    };

    const removeItem = async (cartItemId) => {
        const token = getToken();
        const res = await fetch(`${API_URL}/api/carts/${cartItemId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Lỗi xóa sản phẩm."); }
        await fetchCart();
    };

    const clearCart = async () => {
        const token = getToken();
        const res = await fetch(`${API_URL}/api/carts`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Lỗi xóa giỏ."); }
        setItems([]); setTotal(0);
    };

    return (
        <CartContext.Provider value={{ items, total, itemCount, loading, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
};

export default CartContext;
