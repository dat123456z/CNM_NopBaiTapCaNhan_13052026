import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

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

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`${API_BASE}/api/products/${id}`, {
                    signal: controller.signal
                });

                if (!res.ok) throw new Error("Load product failed");

                const data = await res.json();

                setProduct(data);

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

    const images = useMemo(() => {
        if (!product) return [];
        if (Array.isArray(product.images)) return product.images;
        if (typeof product.images === "string") {
            try { return JSON.parse(product.images); } catch { return []; }
        }
        return product.image ? [product.image] : [];
    }, [product]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!product) return <div className="p-4">Not found</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">

            <div className="flex gap-6">

                <div className="w-1/2">
                    {images.length ? (
                        <img src={images[0]} className="w-full rounded-xl" />
                    ) : (
                        <div>No image</div>
                    )}
                </div>

                <div className="w-1/2">
                    <h1 className="text-2xl font-bold">{product.title}</h1>

                    <div className="text-xl text-primary mt-2">
                        {Number(product.price).toLocaleString()}₫
                    </div>

                    <p className="mt-4 text-gray-600">
                        {product.description || "No description"}
                    </p>
                </div>

            </div>

            <div className="mt-10">
                <h2 className="font-semibold mb-4">Sản phẩm tương tự</h2>

                <div className="grid grid-cols-3 gap-4">
                    {similarProducts.map(p => (
                        <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}>
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ProductDetail;