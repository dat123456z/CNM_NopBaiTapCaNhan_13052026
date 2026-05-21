import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { useCart } from "../../context/CartContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const normalizeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Interactive states
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            try {
                setLoading(true);
                setError("");
                setQuantity(1);
                setSuccess(false);

                const res = await fetch(`${API_BASE}/api/products/${id}`, {
                    signal: controller.signal
                });

                if (!res.ok) throw new Error("Load product failed");

                const data = await res.json();
                setProduct(data);

                // Set default color if available
                if (data.colors && data.colors.length > 0) {
                    setSelectedColor(data.colors[0].label);
                } else {
                    setSelectedColor("");
                }

                if (Array.isArray(data?.similar) && data.similar.length) {
                    const r = await fetch(
                        `${API_BASE}/api/products?ids=${data.similar.join(",")}`,
                        { signal: controller.signal }
                    );
                    const simData = await r.json();
                    const list = normalizeArray(simData);
                    setSimilarProducts(
                        list.filter(p => String(p.id) !== String(data.id))
                    );
                } else {
                    setSimilarProducts([]);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Error");
                }
            } finally {
                setLoading(false);
            }
        };

        load();
        return () => controller.abort();
    }, [id]);

    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        setActiveImage(0);
    }, [id]);

    const images = useMemo(() => {
        if (!product) return [];
        if (Array.isArray(product.images)) return product.images;
        if (typeof product.images === "string") {
            try { return JSON.parse(product.images); } catch { return []; }
        }
        return product.image ? [product.image] : [];
    }, [product]);

    const handleQuantityChange = (val) => {
        if (val < 1) return;
        setQuantity(val);
    };

    const handleAddToCart = async () => {
        if (adding) return;
        setAdding(true);
        try {
            await addToCart(product.id, quantity, selectedColor);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            alert(err.message || "Lỗi thêm giỏ hàng");
        } finally {
            setAdding(false);
        }
    };

    const handleBuyNow = async () => {
        try {
            await addToCart(product.id, quantity, selectedColor);
            navigate("/checkout");
        } catch (err) {
            alert(err.message || "Lỗi mua ngay");
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!product) return <div className="p-4">Not found</div>;

    return (
        <div className="min-h-screen bg-[#f8f9fb]">
            <Header />

            <main className="max-w-6xl mx-auto p-4 pt-10">
                <div className="flex gap-10">
                    {/* Left: Images */}
                    <div className="w-1/2">
                        {images.length ? (
                            <div className="flex flex-col gap-4">
                                <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                    <img src={images[activeImage]} className="w-full h-full object-cover" alt={product.title} />
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {images.map((img, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => setActiveImage(idx)}
                                            className={`w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${activeImage === idx ? 'border-blue-600' : 'border-transparent hover:border-gray-300'}`}
                                        >
                                            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">Không có hình ảnh</div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="w-1/2">
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.title}</h1>

                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1 text-orange-400">
                                {'★'.repeat(Math.round(product.rating || 5)) + '☆'.repeat(5 - Math.round(product.rating || 5))}
                                <span className="text-gray-500 ml-1">{product.rating ? Number(product.rating).toFixed(1) : '5.0'} ({product.reviewCount || 124} reviews)</span>
                            </span>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 mt-5">
                            {Number(product.price).toLocaleString()}đ
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-xl text-gray-400 line-through ml-3 font-medium">{Number(product.originalPrice).toLocaleString()}đ</span>
                            )}
                        </div>

                        <p className="mt-5 text-gray-600 leading-relaxed text-sm">
                            {product.description || "Chưa có mô tả cho sản phẩm này."}
                        </p>

                        {/* Colors */}
                        <div className="mt-8">
                            <div className="text-sm font-semibold mb-3 text-gray-800">
                                Màu sắc: <span className="font-bold text-blue-600">{selectedColor || "Mặc định"}</span>
                            </div>
                            <div className="flex gap-3">
                                {product.colors && product.colors.length > 0 ? (
                                    product.colors.map((c, i) => (
                                        <button 
                                            key={i} 
                                            title={c.label} 
                                            onClick={() => setSelectedColor(c.label)}
                                            className={`w-8 h-8 rounded-full border border-gray-300 transition-all ${selectedColor === c.label ? 'ring-2 ring-offset-2 ring-blue-600 scale-110' : 'hover:scale-105'}`} 
                                            style={{ backgroundColor: c.value }}
                                        ></button>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-400">Không có phân loại màu sắc</div>
                                )}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mt-6">
                            <div className="text-sm font-semibold mb-3 text-gray-800">Số lượng</div>
                            <div className="flex items-center border border-gray-300 rounded-md w-28 h-10 bg-white overflow-hidden">
                                <button 
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    className="w-1/3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                                >
                                    -
                                </button>
                                <input 
                                    type="text" 
                                    value={quantity} 
                                    readOnly 
                                    className="w-1/3 h-full text-center border-none bg-transparent focus:outline-none text-sm font-semibold text-gray-800" 
                                />
                                <button 
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    className="w-1/3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-8 flex flex-col gap-3">
                            <button 
                                onClick={handleAddToCart}
                                disabled={adding}
                                className={`w-full text-white font-semibold py-3.5 rounded-md transition flex items-center justify-center gap-2 ${
                                    success 
                                        ? "bg-green-600 hover:bg-green-700" 
                                        : "bg-[#0057b7] hover:bg-blue-700"
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                {adding ? "Đang thêm..." : success ? "Đã thêm vào giỏ thành công! ✓" : "Thêm vào giỏ hàng"}
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                className="w-full bg-white text-[#0057b7] border border-blue-300 font-semibold py-3.5 rounded-md hover:bg-blue-50 transition"
                            >
                                Mua ngay
                            </button>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500 bg-white">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                Miễn phí vận chuyển toàn quốc cho đơn từ 500.000đ
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500 bg-white">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                Bảo hành chính hãng 2 năm
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500 bg-white">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                Đổi trả miễn phí trong vòng 30 ngày
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-gray-200 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-blue-600 mb-3"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c-1.105 0-2-.895-2-2V7m2 12a2 2 0 002-2V7m-2 12c-1.105 0-2-.895-2-2V7"></path></svg></div>
                            <h3 className="font-bold text-gray-900 mb-2">Chất lượng cao</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Sản phẩm được gia công tỉ mỉ với độ bền vượt trội và tính thẩm mỹ cao.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-blue-600 mb-3"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                            <h3 className="font-bold text-gray-900 mb-2">Tiêu dùng thông minh</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Đáp ứng tối đa nhu cầu của người dùng hiện đại với chi phí hợp lý nhất.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-blue-600 mb-3"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg></div>
                            <h3 className="font-bold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Đội ngũ CSKH chuyên nghiệp luôn sẵn sàng hỗ trợ khách hàng mọi lúc.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 mb-16">
                    <h2 className="font-bold text-xl mb-6 text-gray-900 border-b pb-3 border-gray-200">Sản phẩm tương tự</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {similarProducts.map(p => (
                            <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer h-full">
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetail;