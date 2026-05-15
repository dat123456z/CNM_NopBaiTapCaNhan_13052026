import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

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

                const response = await fetch(`${API_BASE}/api/products`, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error("Không tải được danh sách sản phẩm");
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Có lỗi xảy ra khi tải sản phẩm");
                }
            } finally {
                setLoading(false);
            }
        };

        loadProducts();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            const token = localStorage.getItem("token");

            if (!user || !token) {
                navigate("/login");
                return;
            }
            if (user.role && user.role !== "user") {
                navigate("/login");
            }
        } catch {
            navigate("/login");
        }
    }, [navigate]);

    const promos = useMemo(() => products.filter((p) => Number(p.originalPrice) > Number(p.price)), [products]);
    const newest = useMemo(() => products.slice(0, 6), [products]);
    const bestsellers = useMemo(() => [...products].sort((a, b) => Number(b.sold || 0) - Number(a.sold || 0)).slice(0, 6), [products]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">Đang tải sản phẩm...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Header title="UTEShop" subtitle="Sàn thương mại điện tử - Ưu đãi và sản phẩm mới mỗi ngày">
                <div className="mt-6 max-w-3xl">
                    <div className="bg-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold">Khuyến mãi tuần này</h2>
                        <p className="mt-1 text-sm opacity-90">Giảm giá tới 30% cho các sản phẩm chọn lọc - số lượng có hạn.</p>
                    </div>
                </div>
            </Header>

            <main className="container mx-auto px-4 mt-8">
                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Khuyến mãi</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {promos.map((p) => (
                            <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer hover:shadow-lg transition-shadow">
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Mới nhất</h3>
                        <Link to="/" className="text-primary text-sm">Xem tất cả</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {newest.map((p) => (
                            <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer hover:shadow-lg transition-shadow">
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Bán chạy</h3>
                        <Link to="/" className="text-primary text-sm">Xem tất cả</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bestsellers.map((p) => (
                            <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer hover:shadow-lg transition-shadow">
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
