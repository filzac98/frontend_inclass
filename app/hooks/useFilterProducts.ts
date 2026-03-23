import { useState } from "react";
import { products } from "../../dummy-data/products";

export function useFilterProducts() {
    const [search, setSearch] = useState("");
    
    const filteredProducts = products.filter((prod) => 
        prod.name.toLowerCase().includes(search.toLowerCase()) ||
        prod.category.toLowerCase().includes(search.toLowerCase()) ||
        prod.price < Number(search)
    )

    return {
        filteredProducts,
        search, 
        setSearch
    }

}