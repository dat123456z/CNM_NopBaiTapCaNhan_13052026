import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";

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
        <div className="min-h-screen bg-[#f8f9fb]">
            <Header />

            <div className="max-w-7xl mx-auto px-6 mt-6 mb-2">
                <div className="w-full relative rounded-2xl overflow-hidden shadow-lg group" style={{ minHeight: '320px' }}>
                    <img 
                        src="/homepage_banner.png" 
                        alt="Khuyến mãi đặc biệt" 
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center px-10 md:px-16">
                        <span className="text-[#00b14f] font-bold tracking-wider uppercase mb-2">Ưu đãi mùa hè</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
                            Bùng nổ phong cách <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b14f] to-green-300">Sale Up To 50%</span>
                        </h2>
                        <p className="text-base text-gray-200 mb-8 max-w-md drop-shadow">
                            Khám phá ngay bộ sưu tập thời trang và công nghệ mới nhất. Số lượng có hạn, chốt đơn liền tay!
                        </p>
                        <div>
                            <button 
                                onClick={() => navigate('/products')} 
                                className="bg-[#00b14f] hover:bg-[#008a3d] text-white px-8 py-3 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,177,79,0.5)]"
                            >
                                Mua sắm ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 mt-8">

                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Khuyến mãi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {promos.map(p => (
                            <div key={p.id} className="cursor-pointer h-full" onClick={() => navigate(`/product/${p.id}`)}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Mới nhất</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newest.map(p => (
                            <div key={p.id} className="cursor-pointer h-full" onClick={() => navigate(`/product/${p.id}`)}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Bán chạy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bestsellers.map(p => (
                            <div key={p.id} className="cursor-pointer h-full" onClick={() => navigate(`/product/${p.id}`)}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
};

export default HomePage;