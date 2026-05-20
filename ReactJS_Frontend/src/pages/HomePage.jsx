import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const normalizeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

const HomePage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("accessToken");

                const res = await fetch(`${API_BASE}/api/products`, {
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                    }
                });

                if (res.status === 401) {
                    localStorage.clear();
                    navigate("/login");
                    return;
                }

                if (!res.ok) throw new Error("Load products failed");

                const data = await res.json();
                setProducts(normalizeArray(data));

            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Error");
                }
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
        return () => controller.abort();
    }, [navigate]);

    const promos = useMemo(
        () => products.filter(p => Number(p.originalPrice) > Number(p.price)),
        [products]
    );

    const newest = useMemo(() => products.slice(0, 6), [products]);

    const bestsellers = useMemo(
        () => [...products]
            .sort((a, b) => Number(b.sold || 0) - Number(a.sold || 0))
            .slice(0, 6),
        [products]
    );

    if (loading) return <div className="p-4">Loading...</div>;

    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Header title="UTEShop" subtitle="..." />

            <main className="container mx-auto px-4 mt-8">

                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Khuyến mãi</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {promos.map(p => (
                            <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Mới nhất</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {newest.map(p => (
                            <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-semibold mb-4">Bán chạy</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {bestsellers.map(p => (
                            <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default HomePage;