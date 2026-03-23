import { useState } from "react";
import { Product } from "../../types/product";

export function useCart() {
    const [cartItemCount, setCartItemCount] = useState(0); // 
    const [cartItems, setCartItems] = useState([] as Product[])
    
        
 const addToCart = (product: Product) =>  {
        setCartItemCount(cartItemCount => cartItemCount+1);
        setCartItems([...cartItems, product])
    }
    
       
    const remoteFromCart = () => {

    }


    return {
        addToCart,
        cartItems,
        cartItemCount,
        setCartItems,
        remoteFromCart
    }
}