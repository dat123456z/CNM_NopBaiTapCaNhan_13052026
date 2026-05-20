import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const SORT_OPTIONS = [
    { value: "newest", label: "Mới nhất" },
    { value: "price_asc", label: "Giá tăng dần" },
    { value: "price_desc", label: "Giá giảm dần" },
    { value: "bestseller", label: "Bán chạy nhất" },
    { value: "discount", label: "Giảm giá nhiều nhất" },
];

const PRICE_RANGES = [
    { value: "all", label: "Tất cả mức giá" },
    { value: "0-200000", label: "Dưới 200.000đ" },
    { value: "200000-500000", label: "200.000đ – 500.000đ" },
    { value: "500000-1000000", label: "500.000đ – 1.000.000đ" },
    { value: "1000000-999999999", label: "Trên 1.000.000đ" },
];

const STOCK_OPTIONS = [
    { value: "all", label: "Tất cả" },
    { value: "instock", label: "Còn hàng" },
    { value: "outofstock", label: "Hết hàng" },
];

const FilterChip = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: "6px 14px",
            borderRadius: "999px",
            border: active ? "2px solid #e11d48" : "1.5px solid #e5e7eb",
            background: active ? "#fff1f2" : "#fff",
            color: active ? "#e11d48" : "#374151",
            fontWeight: active ? 700 : 500,
            fontSize: "0.82rem",
            cursor: "pointer",
            transition: "all 0.18s",
            fontFamily: "'Be Vietnam Pro', sans-serif",
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
        }}
    >
        {label}
    </button>
);

const ProductPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [priceRange, setPriceRange] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");
    const [onlyDiscount, setOnlyDiscount] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userRaw = localStorage.getItem("user");

        if (!token || !userRaw) {
            navigate("/login", { replace: true });
            return;
        }

        try {
            const user = JSON.parse(userRaw);
            if (user?.role !== "user") {
                navigate("/login", { replace: true });
            }
        } catch {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await fetch(`${API_BASE}/api/products`, { signal: controller.signal });
                if (!res.ok) throw new Error("Không tải được danh sách sản phẩm");
                const data = await res.json();

                setProducts(
                    Array.isArray(data)
                        ? data
                        : data?.products || data?.data || []
                );
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message || "Có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        };
        load();
        return () => controller.abort();
    }, []);

    const categories = useMemo(() => {
        const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
        return ["all", ...cats];
    }, [products]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        setSearch(searchInput.trim());
    }, [searchInput]);

    const clearFilters = () => {
        setSearch("");
        setSearchInput("");
        setSelectedCategory("all");
        setPriceRange("all");
        setStockFilter("all");
        setOnlyDiscount(false);
        setSortBy("newest");
    };

    const filtered = useMemo(() => {
        let list = [...products];

        if (search) {
            const q = search.toLowerCase();
            list = list.filter(
                (p) =>
                    p.title?.toLowerCase().includes(q) ||
                    p.desc?.toLowerCase().includes(q) ||
                    p.category?.toLowerCase().includes(q)
            );
        }

        if (selectedCategory !== "all") {
            list = list.filter((p) => p.category === selectedCategory);
        }

        if (priceRange !== "all") {
            const [min, max] = priceRange.split("-").map(Number);
            list = list.filter((p) => Number(p.price) >= min && Number(p.price) <= max);
        }

        if (stockFilter === "instock") list = list.filter((p) => p.stock > 0);
        if (stockFilter === "outofstock") list = list.filter((p) => p.stock === 0);

        if (onlyDiscount) {
            list = list.filter((p) => p.originalPrice && Number(p.originalPrice) > Number(p.price));
        }

        switch (sortBy) {
            case "price_asc": list.sort((a, b) => Number(a.price) - Number(b.price)); break;
            case "price_desc": list.sort((a, b) => Number(b.price) - Number(a.price)); break;
            case "bestseller": list.sort((a, b) => Number(b.sold || 0) - Number(a.sold || 0)); break;
            case "discount":
                list.sort((a, b) => {
                    const da = a.originalPrice ? Number(a.originalPrice) - Number(a.price) : 0;
                    const db = b.originalPrice ? Number(b.originalPrice) - Number(b.price) : 0;
                    return db - da;
                });
                break;
            default: break;
        }

        return list;
    }, [products, search, selectedCategory, priceRange, stockFilter, onlyDiscount, sortBy]);

    const activeFilterCount = [
        selectedCategory !== "all",
        priceRange !== "all",
        stockFilter !== "all",
        onlyDiscount,
    ].filter(Boolean).length;

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #fce7f3", borderTopColor: "#e11d48", animation: "spin 0.8s linear infinite" }} />
                    <span style={{ color: "#6b7280", fontWeight: 500 }}>Đang tải sản phẩm...</span>
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
                <div style={{ background: "#fff", padding: 32, borderRadius: 16, textAlign: "center", boxShadow: "0 4px 24px #0001" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                    <p style={{ color: "#dc2626", fontWeight: 600, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                input:focus { outline: none; }
                select:focus { outline: none; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }
                .prod-card-wrap { transition: transform 0.18s, box-shadow 0.18s; }
                .prod-card-wrap:hover { transform: translateY(-3px); box-shadow: 0 8px 32px #e11d4822; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                .fade-up { animation: fadeUp 0.35s ease both; }
            `}</style>

            <Header title="UTEShop" subtitle="Khám phá tất cả sản phẩm - Tìm kiếm, lọc và mua sắm dễ dàng">
                <div style={{ marginTop: 20 }}>
                    <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, maxWidth: 520 }}>
                        <div style={{ flex: 1, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "0 14px", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                            <span style={{ marginRight: 8, opacity: 0.7, fontSize: 16 }}>🔍</span>
                            <input
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Tìm kiếm sản phẩm..."
                                style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: "0.92rem", padding: "10px 0", fontFamily: "'Be Vietnam Pro', sans-serif" }}
                            />
                            {searchInput && (
                                <button type="button" onClick={() => { setSearchInput(""); setSearch(""); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 16, padding: 0 }}>✕</button>
                            )}
                        </div>
                        <button type="submit" style={{ background: "#fff", color: "#e11d48", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 700, cursor: "pointer", fontSize: "0.88rem", fontFamily: "'Be Vietnam Pro', sans-serif", transition: "opacity 0.15s" }}>
                            Tìm
                        </button>
                    </form>
                </div>
            </Header>

            <main style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 16px", display: "flex", gap: 24, alignItems: "flex-start" }}>
                <aside style={{
                    width: sidebarOpen ? 240 : 52,
                    minWidth: sidebarOpen ? 240 : 52,
                    background: "#fff",
                    borderRadius: 16,
                    padding: sidebarOpen ? "20px 18px" : "20px 10px",
                    boxShadow: "0 2px 12px #0000000a",
                    position: "sticky",
                    top: 20,
                    transition: "all 0.25s ease",
                    overflow: "hidden",
                    alignSelf: "flex-start",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: sidebarOpen ? 20 : 0 }}>
                        {sidebarOpen && <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111" }}>Bộ lọc {activeFilterCount > 0 && <span style={{ background: "#e11d48", color: "#fff", borderRadius: "99px", fontSize: "0.7rem", padding: "1px 7px", marginLeft: 6 }}>{activeFilterCount}</span>}</span>}
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#374151", flexShrink: 0 }}>
                            {sidebarOpen ? "◀" : "▶"}
                        </button>
                    </div>

                    {sidebarOpen && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                            <div>
                                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Danh mục</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    {categories.map((cat) => (
                                        <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                                            textAlign: "left", padding: "7px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif",
                                            background: selectedCategory === cat ? "#fff1f2" : "transparent",
                                            color: selectedCategory === cat ? "#e11d48" : "#374151",
                                            fontWeight: selectedCategory === cat ? 700 : 500,
                                            fontSize: "0.85rem",
                                            transition: "all 0.15s",
                                        }}>
                                            {cat === "all" ? "Tất cả" : cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Mức giá</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    {PRICE_RANGES.map((r) => (
                                        <button key={r.value} onClick={() => setPriceRange(r.value)} style={{
                                            textAlign: "left", padding: "7px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif",
                                            background: priceRange === r.value ? "#fff1f2" : "transparent",
                                            color: priceRange === r.value ? "#e11d48" : "#374151",
                                            fontWeight: priceRange === r.value ? 700 : 500,
                                            fontSize: "0.85rem",
                                            transition: "all 0.15s",
                                        }}>
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Tình trạng</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    {STOCK_OPTIONS.map((o) => (
                                        <button key={o.value} onClick={() => setStockFilter(o.value)} style={{
                                            textAlign: "left", padding: "7px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif",
                                            background: stockFilter === o.value ? "#fff1f2" : "transparent",
                                            color: stockFilter === o.value ? "#e11d48" : "#374151",
                                            fontWeight: stockFilter === o.value ? 700 : 500,
                                            fontSize: "0.85rem",
                                            transition: "all 0.15s",
                                        }}>
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Khác</p>
                                <button onClick={() => setOnlyDiscount(!onlyDiscount)} style={{
                                    display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif", width: "100%",
                                    background: onlyDiscount ? "#fff1f2" : "transparent",
                                    color: onlyDiscount ? "#e11d48" : "#374151",
                                    fontWeight: onlyDiscount ? 700 : 500,
                                    fontSize: "0.85rem",
                                    transition: "all 0.15s",
                                }}>
                                    <span style={{ width: 16, height: 16, borderRadius: 4, border: onlyDiscount ? "2px solid #e11d48" : "2px solid #d1d5db", background: onlyDiscount ? "#e11d48" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        {onlyDiscount && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>}
                                    </span>
                                    Chỉ hàng giảm giá
                                </button>
                            </div>

                            {activeFilterCount > 0 && (
                                <button onClick={clearFilters} style={{ padding: "8px 0", background: "none", border: "1.5px dashed #fca5a5", borderRadius: 8, color: "#e11d48", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif", transition: "all 0.15s" }}>
                                    Xóa tất cả bộ lọc
                                </button>
                            )}
                        </div>
                    )}
                </aside>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                        <div>
                            <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#111" }}>
                                {search ? `Kết quả cho "${search}"` : "Tất cả sản phẩm"}
                            </span>
                            <span style={{ color: "#9ca3af", fontSize: "0.85rem", marginLeft: 8 }}>({filtered.length} sản phẩm)</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: "#6b7280", fontSize: "0.83rem", whiteSpace: "nowrap" }}>Sắp xếp:</span>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
                                border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "7px 12px", fontSize: "0.85rem", fontFamily: "'Be Vietnam Pro', sans-serif", color: "#374151", background: "#fff", cursor: "pointer", fontWeight: 500,
                            }}>
                                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {(search || activeFilterCount > 0) && (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                            {search && <FilterChip label={`🔍 "${search}"`} active onClick={() => { setSearch(""); setSearchInput(""); }} />}
                            {selectedCategory !== "all" && <FilterChip label={`📂 ${selectedCategory}`} active onClick={() => setSelectedCategory("all")} />}
                            {priceRange !== "all" && <FilterChip label={`💰 ${PRICE_RANGES.find(r => r.value === priceRange)?.label}`} active onClick={() => setPriceRange("all")} />}
                            {stockFilter !== "all" && <FilterChip label={`📦 ${STOCK_OPTIONS.find(o => o.value === stockFilter)?.label}`} active onClick={() => setStockFilter("all")} />}
                            {onlyDiscount && <FilterChip label="🏷️ Giảm giá" active onClick={() => setOnlyDiscount(false)} />}
                        </div>
                    )}

                    {filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
                            <div style={{ fontSize: 56, marginBottom: 16 }}>🛍️</div>
                            <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "#374151", marginBottom: 8 }}>Không tìm thấy sản phẩm</p>
                            <p style={{ fontSize: "0.9rem", marginBottom: 20 }}>Thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm</p>
                            <button onClick={clearFilters} style={{ background: "#e11d48", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: "0.9rem" }}>
                                Xóa bộ lọc
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                            {filtered.map((p, i) => (
                                <div
                                    key={p.id}
                                    className="prod-card-wrap fade-up"
                                    style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s`, cursor: "pointer" }}
                                    onClick={() => navigate(`/product/${p.id}`)}
                                >
                                    <ProductCard product={p} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProductPage;