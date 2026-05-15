import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageSwiper from "../components/ImageSwiper";
import ProductCard from "../components/ProductCard";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const controller = new AbortController();

        const loadProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_BASE}/api/products/${id}`, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error("Không tải được sản phẩm");
                }

                const data = await response.json();
                setProduct(data);

                if (data.similar?.length) {
                    const similarResponse = await fetch(`${API_BASE}/api/products?ids=${data.similar.join(",")}`, {
                        signal: controller.signal,
                    });
                    if (similarResponse.ok) {
                        const similarData = await similarResponse.json();
                        setSimilarProducts(similarData.filter((item) => String(item.id) !== String(data.id)));
                    } else {
                        setSimilarProducts([]);
                    }
                } else {
                    setSimilarProducts([]);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Có lỗi xảy ra khi tải sản phẩm");
                }
            } finally {
                setLoading(false);
            }
        };

        loadProduct();

        return () => controller.abort();
    }, [id]);

    const increase = () => setQty((q) => Math.min(q + 1, product?.stock || 9999));
    const decrease = () => setQty((q) => Math.max(1, q - 1));

    const productImages = useMemo(() => product?.images?.length ? product.images : product?.image ? [product.image] : [], [product]);

    if (loading) {
        return <div className="max-w-6xl mx-auto p-4">Đang tải sản phẩm...</div>;
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-4">
                <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">{error}</div>
                <button onClick={() => navigate(-1)} className="mt-4 text-sm text-gray-500">Quay lại</button>
            </div>
        );
    }

    if (!product) {
        return <div className="max-w-6xl mx-auto p-4">Không tìm thấy sản phẩm.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex gap-6">
                <div className="w-1/2">
                    <ImageSwiper images={productImages} />
                </div>
                <div className="w-1/2">
                    <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                    <div className="text-sm text-gray-500 mb-3">
                        Danh mục: <span className="font-medium">{product.category || "Chưa có danh mục"}</span>
                    </div>
                    <p className="text-gray-700 mb-4">{product.desc || "Chưa có mô tả"}</p>

                    <div className="mb-4">
                        <div className="text-2xl text-primary font-bold">{product.price.toLocaleString()}₫</div>
                        {product.originalPrice && (
                            <div className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()}₫</div>
                        )}
                        <div className="text-sm text-gray-500">{product.sold} đã bán</div>
                    </div>

                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex items-center border rounded">
                            <button onClick={decrease} className="px-3">-</button>
                            <div className="px-4">{qty}</div>
                            <button onClick={increase} className="px-3">+</button>
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded">Thêm vào giỏ</button>
                    </div>

                    {product.stock <= 5 && (
                        <div className={`p-3 rounded ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {product.stock === 0 ? 'Hết hàng' : `Chỉ còn ${product.stock} sản phẩm`}
                        </div>
                    )}

                    <div className="mt-4">
                        <button onClick={() => navigate(-1)} className="text-sm text-gray-500">Quay lại</button>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Sản phẩm tương tự</h2>
                <div className="grid grid-cols-3 gap-4">
                    {similarProducts.map((p) => (
                        <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer">
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
