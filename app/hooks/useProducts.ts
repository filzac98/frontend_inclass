"use client";

import { useCallback, useEffect, useState } from "react";
import { Product } from "../../types/product";

export function useProducts(search: string = "") {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const baseUrl = ""; // 'https://localhost:8080'
    // READ — fetch all products
    //
    // useCallback prevents a new function from being created on every render.
    // This is REQUIRED here because fetchProducts is used as a dependency in
    // the useEffect below. Without useCallback, every render would produce a
    // new function reference, which would trigger the effect again, causing
    // another fetch, another state update, another render — an infinite loop.
    // The empty array [] means the function is only created once (on mount).
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {  
            const url = search
                ? `/api/products?search=${encodeURIComponent(search)}`
                : "/api/products";
            const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch products");
                setProducts(await res.json()); } 
        catch (e) {
                setError((e as Error).message);} 
        finally {
                setLoading(false);
            }
    }, [search]);

    // useEffect runs *after* the component mounts (appears on screen).
    // The function inside it calls fetchProducts to load the data from the API.
    // The dependency array [fetchProducts] tells React: "re-run this effect
    // whenever fetchProducts changes". Because fetchProducts is wrapped in
    // useCallback with [], it never changes — so this effect runs exactly once,
    // on mount. This is the standard pattern for fetching data when a page loads.
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // CREATE
    //
    // useCallback here is optional (there is no useEffect depending on it),
    // but it is a good habit: if this function is passed as a prop to a child
    // component wrapped in React.memo (tells React to skip re-rendering a component 
    // if its props haven't changed.), a stable reference prevents that child
    // from re-rendering unnecessarily every time the parent renders.
    const createProduct = useCallback(async (data: Omit<Product, "id">) => {
        // MSW handles POST and returns the new product with an auto-generated id.
        // With a real backend this fetch call stays exactly the same —
        // just make sure the server also responds with the created product (201).
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/api/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to create product");
            }

            const newProduct = (await response.json()) as Product;
            setProducts((prev) => [...prev, newProduct]);
            return newProduct;
        } catch (e) {
            setError((e as Error).message);
            throw e;
        } finally {
            setLoading(false);
        }

    }, []);

    // UPDATE — same reasoning as createProduct above
    const updateProduct = useCallback(async (id: number, data: Partial<Omit<Product, "id">>) => {
        // MSW handles PUT and merges the fields in the in-memory store.
        // Some REST APIs use PATCH instead of PUT for partial updates —
        // change method: "PUT" to method: "PATCH" if your backend requires it.
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update product");
            }
            const updatedProduct = (await response.json()) as Product;
            setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
            return updatedProduct;
        } catch (e) {
            setError((e as Error).message);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    // DELETE — same reasoning as createProduct above
    const deleteProduct = useCallback(async (id: number) => {
        // MSW handles DELETE and returns 204 No Content.
        // The real backend should also return 204 for this to work as-is.
        // If it returns 200 with a body instead, no changes are needed here
        // since we don't read the response body.
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/api/products/${id}`, {
                method: "DELETE",
            });

            // if (!response.ok) {
            //     const maybeJson = await response.json().catch(() => null);
            //     const message = maybeJson && typeof maybeJson === "object" && "message" in maybeJson
            //         ? String((maybeJson as { message: unknown }).message)
            //         : "Failed to delete product";
            //     throw new Error(message);
            // }

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            if (response.status === 204) {
                setProducts((prev) => prev.filter((p) => p.id !== id));
            }

            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (e) {
            setError((e as Error).message);
            throw e;
        } finally {
            setLoading(false);
        }  
    }, []);

    return { products, loading, error, createProduct, updateProduct, deleteProduct };
}

