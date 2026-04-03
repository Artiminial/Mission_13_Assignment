import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem } from "../types/CartItem";

interface CartContextType{
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    updateQuantity: (BookID: number, quantity: number) => void;
    removeFromCart:(BookID: number) => void;
    clearCart: () => void;
    getLineSubtotal: (item: CartItem) => number;
    getCartTotal: () => number;
    getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_SESSION_KEY = "book-project-cart";

export const CartProvider = ({children}: {children: ReactNode}) => {
    // Persist cart for the current browser session.
    const [cart, setCart] = useState<CartItem[]>(() => {
        const storedCart = sessionStorage.getItem(CART_SESSION_KEY);
        if (!storedCart) return [];

        try {
            return JSON.parse(storedCart) as CartItem[];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        sessionStorage.setItem(CART_SESSION_KEY, JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((c) => c.BookID === item.BookID);
            if (!existingItem) {
                return [...prevCart, item];
            }

            return prevCart.map((c) =>
                c.BookID === item.BookID
                    ? { ...c, Quantity: c.Quantity + item.Quantity }
                    : c
            );
        });
    };

    const updateQuantity = (BookID: number, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((c) =>
                c.BookID === BookID ? { ...c, Quantity: Math.max(1, quantity) } : c
            )
        );
    };

    const removeFromCart = (BookID: number) => {
        setCart((prevCart) => prevCart.filter((c) => c.BookID !== BookID));
    };

    const clearCart = () =>{
        setCart(() => []);
    };

    const getLineSubtotal = (item: CartItem) => item.UnitPrice * item.Quantity;
    const getCartTotal = () => cart.reduce((sum, item) => sum + getLineSubtotal(item), 0);
    const getCartCount = () => cart.reduce((sum, item) => sum + item.Quantity, 0);

    return(
        <CartContext.Provider value={{cart, addToCart, updateQuantity, removeFromCart, clearCart, getLineSubtotal, getCartTotal, getCartCount}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext)
    if(!context){
        throw new Error('useCart must be used within a CartProvider')
    }
    return context;
}