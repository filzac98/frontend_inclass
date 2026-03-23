"use client"

import Link from "next/link";
import { products } from "../../dummy-data/products";
import ProductCard from "../../components/ProductCard";
import { useState } from "react";
import { Product } from "../../types/product";
import { log } from "console";
import Cart from "../../components/Cart";

export default function Products() {

    // Opret en custom hook (se slide)
    // flyt kode fra denne komponent til useCart (custom hook'en).
    // Importer de samme funktioner til denne komponent.

    const [search, setSearch] = useState("");
    const [cartItemCount, setCartItemCount] = useState(0); // 
    const [cartItems, setCartItems] = useState([] as Product[])

    const filteredProducts = products.filter((prod) => 
        prod.name.toLowerCase().includes(search.toLowerCase()) ||
        prod.category.toLowerCase().includes(search.toLowerCase()) ||
        prod.price < Number(search)
    )
    //console.log(filteredProducts);
    const addToCart = (product: Product) =>  {
        setCartItemCount(cartItemCount => cartItemCount+1);
        setCartItems([...cartItems, product])
    }
    const remoteFromCart = () => {

    }

    return (
        <div>
            <Cart cart={cartItems} cartItemCount={cartItemCount}></Cart>
            <h1>Products</h1>
            <h2>Item count in cart: {cartItemCount}</h2>
            <input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />

            <div className="grid">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} 
                        setCartItemCount={() => addToCart(product)}/>
                ))}
            </div>
            {filteredProducts.length===0 && <p>No products found</p>}

            <Link href="/products/2">Product 2</Link>
        </div>
    );
}